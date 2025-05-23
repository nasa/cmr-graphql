import chunk from 'lodash/chunk'
import fromPairs from 'lodash/fromPairs'
import isObject from 'lodash/isObject'

import { cmrGraphDb } from '../utils/cmrGraphDb'
import { getUserPermittedGroups } from '../utils/getUserPermittedGroups'
import { mergeParams } from '../utils/mergeParams'

/**
 * Queries CMR GraphDB for related collections.
 * @param {String} conceptId ConceptID for the initial collection to find relationships on.
 * @param {String} params Search parameters for the relationship search.
 * @param {String} headers Headers to be passed to CMR.
 */
export default async (
  source,
  params,
  context,
  parsedInfo
) => {
  const { conceptId } = source
  const { edlUsername, headers } = context

  // Parse the request info to find the requested types in the query
  const { fieldsByTypeName } = parsedInfo
  const { RelatedCollectionsList: relatedCollectionsList } = fieldsByTypeName
  const { items } = relatedCollectionsList
  const { fieldsByTypeName: relatedCollectionsListFields } = items
  const { RelatedCollection: relatedCollection } = relatedCollectionsListFields
  const { relationships = {} } = relatedCollection
  const { fieldsByTypeName: relationshipsFields = {} } = relationships
  const { Relationship: relationshipFields = {} } = relationshipsFields

  // Merge nested 'params' object with existing parameters
  const queryParams = mergeParams(params)
  const {
    limit = 20,
    offset = 0
  } = queryParams

  // Check which relationship types were requested
  const relationshipTypeRequested = Object.keys(relationshipFields).includes('relationshipType')

  // Determine which intermediate nodes to include
  let intermediateNodeFilter = '.hasLabel("citation", "scienceKeyword")'

  // Check if we need to filter by specific relationship types
  if (relationshipTypeRequested) {
    const includedTypes = []

    // Add citation and scienceKeyword based on requested fields
    if (Object.keys(relationshipsFields).includes('GraphDbCitation')) {
      includedTypes.push('citation')
    }

    if (Object.keys(relationshipsFields).includes('GraphDbScienceKeyword')) {
      includedTypes.push('scienceKeyword')
    }

    // If specific types are requested, update the filter
    if (includedTypes.length > 0) {
      intermediateNodeFilter = `.hasLabel('${includedTypes.join("','")}')`
    }
  }

  // Retrieve the user groups from EDL to filter the query
  const userGroups = await getUserPermittedGroups(headers, edlUsername)

  const query = JSON.stringify({
    gremlin: `
  g.V()
  .has('collection', 'id', '${conceptId}')
  .where(__.values('permittedGroups').unfold().is(within(${userGroups})))
  .as('start')
  .both()
  ${intermediateNodeFilter}
  .as('intermediateNode')
  .both()
  .hasLabel('collection')
  .where(neq('start'))
  .group()
  .by('id')
  .by(
    project('paths', 'relationshipCount')
    .by(
      path()
      .from('start')
      .by(valueMap(true))
      .fold()
    )
    .by(count(local))
  )
  .order(local)
  .by(select(values).select('relationshipCount'), desc)
  .sideEffect(
    unfold()
    .count()
    .aggregate('totalRelatedCollections')
  )
  .sideEffect(
    unfold()
    .range(${offset}, ${offset + limit})
    .fold()
    .aggregate('relatedCollections')
  )
  .cap('totalRelatedCollections', 'relatedCollections')
  `
  })

  const { data } = await cmrGraphDb({
    conceptId,
    headers,
    query
  })

  const { result } = data

  // Useful for debugging!
  // console.log('GraphDB query', JSON.parse(query))
  // console.log('GraphDB Response result: ', JSON.stringify(result, null, 2))

  const { data: resultData } = result
  const { '@value': dataValues } = resultData

  const collectionsList = []
  let totalRelatedCollectionsCount

  dataValues.forEach((dataValue) => {
    const { '@value': dataValueMap } = dataValue
    const {
      relatedCollections: relatedCollectionsBulkSet,
      totalRelatedCollections: totalRelatedCollectionsBulkSet
    } = fromPairs(chunk(dataValueMap, 2))

    // Parse the count object
    const { '@value': totalRelatedCollectionsMap } = totalRelatedCollectionsBulkSet;
    ([{ '@value': totalRelatedCollectionsCount }] = totalRelatedCollectionsMap)

    // Parse the collection values
    const { '@value': relatedCollectionsListValue } = relatedCollectionsBulkSet
    const [{ '@value': relatedCollectionsMap }] = relatedCollectionsListValue

    relatedCollectionsMap.forEach((relatedCollectionMap) => {
      const { '@value': relatedCollectionMapValues } = relatedCollectionMap
      const [, conceptIdMapping] = relatedCollectionMapValues
      const { '@value': conceptIdMappingValues } = conceptIdMapping

      const {
        paths: pathsList
      } = fromPairs(chunk(conceptIdMappingValues, 2))

      const { '@value': pathValues } = pathsList

      const relationshipsArray = []
      const relatedCollectionValues = {}

      pathValues.forEach((pathValue) => {
        const { '@value': path } = pathValue
        const { objects } = path
        const { '@value': objectValueList } = objects

        // Parse the intermediate node (citation or scienceKeyword)
        const { '@value': intermediateNodeMap } = objectValueList[1] // The intermediate node
        const intermediateNodePairs = chunk(intermediateNodeMap, 2)

        let relationshipType
        const relationshipVertexValues = {}

        intermediateNodePairs.forEach((pair) => {
          const [key, value] = pair

          if (isObject(key)) {
            const { '@value': keyMap } = key

            if (keyMap === 'label') {
              relationshipType = value
              relationshipVertexValues.relationshipType = relationshipType
            }

            return
          }

          const { '@value': valueMap } = value
          const [actualValue] = valueMap
          relationshipVertexValues[key] = actualValue
        })

        relationshipsArray.push(relationshipVertexValues)

        // Parse the related collection vertex
        const { '@value': relatedCollectionVertexMap } = objectValueList[2] // The related collection
        const relatedCollectionVertexPairs = chunk(relatedCollectionVertexMap, 2)

        relatedCollectionVertexPairs.forEach((pair) => {
          const [key, value] = pair

          if (isObject(key)) {
            return
          }

          const { '@value': valueMap } = value
          const [actualValue] = valueMap
          relatedCollectionValues[key] = actualValue
        })
      })

      // Push the data onto the collectionsList to be returned to the resolver
      collectionsList.push({
        ...relatedCollectionValues,
        relationships: relationshipsArray
      })
    })
  })

  const returnObject = {
    count: totalRelatedCollectionsCount,
    items: collectionsList
  }

  // Useful for debugging!
  // console.log('graphDb.js response', JSON.stringify(returnObject, null, 2))

  return returnObject
}
