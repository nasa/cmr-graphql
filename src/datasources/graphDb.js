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

  // IMPORTANT: userGroups must be an array format like ["guest", "registered"]
  // If it returns a string, ensure it's properly formatted for the within() clause
  const query = JSON.stringify({
    gremlin: `
      g.V()
      .has('collection', 'id', '${conceptId}')
      .where(__.values('permittedGroups').unfold().is(within(${userGroups})))
      .as('start')
      .both()
      ${intermediateNodeFilter}
      .as('intermediate')
      .both()
      .hasLabel('collection')
      .has('id', neq('${conceptId}'))
      .as('end')
      .group()
      .by(select('end').values('id'))
      .by(
        select('start', 'intermediate', 'end')
        .by(valueMap(true))
        .fold()
      )
      .unfold()
      .project('id', 'paths', 'count')
      .by(keys)
      .by(select(values))
      .by(select(values).count(local))
      .order()
      .by('count', desc)
      .fold()
      .as('allResults')
      .project('totalRelatedCollections', 'relatedCollections')
      .by(count(local))
      .by(range(local, ${offset}, ${offset + limit}))
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
  let totalRelatedCollectionsCount = 0

  if (dataValues && dataValues.length > 0) {
    const resultMap = dataValues[0]
    const { '@value': resultMapValues } = resultMap

    // Extract totalRelatedCollections and relatedCollections
    const resultObject = fromPairs(chunk(resultMapValues, 2))
    const { totalRelatedCollections, relatedCollections } = resultObject

    // Get the total count
    if (totalRelatedCollections && totalRelatedCollections['@value']) {
      totalRelatedCollectionsCount = totalRelatedCollections['@value']
    }

    // Parse the related collections
    if (relatedCollections && relatedCollections['@value']) {
      const relatedCollectionsData = relatedCollections['@value']

      relatedCollectionsData.forEach((collectionResult) => {
        const { '@value': collectionResultMap } = collectionResult
        const collectionDataPairs = fromPairs(chunk(collectionResultMap, 2))

        const { id, paths, count } = collectionDataPairs

        // Get the collection ID
        const collectionId = id

        // Get the relationship count
        const relationshipCount = count && count['@value'] ? count['@value'] : 0

        // Parse paths
        const relationshipsArray = []
        if (paths && paths['@value']) {
          const pathsList = paths['@value']

          pathsList.forEach((pathData) => {
            const { '@value': pathMap } = pathData
            const pathPairs = fromPairs(chunk(pathMap, 2))

            // Extract the intermediate node data
            if (pathPairs.intermediate && pathPairs.intermediate['@value']) {
              const intermediateMap = pathPairs.intermediate['@value']
              const intermediatePairs = chunk(intermediateMap, 2)

              const relationshipValues = {}
              intermediatePairs.forEach((pair) => {
                const [key, value] = pair

                if (isObject(key)) {
                  const { '@value': keyMap } = key

                  if (keyMap === 'label') {
                    relationshipValues.relationshipType = value
                  }
                } else {
                  const { '@value': valueMap } = value
                  if (valueMap && Array.isArray(valueMap)) {
                    const [actualValue] = valueMap
                    relationshipValues[key] = actualValue
                  }
                }
              })

              relationshipsArray.push(relationshipValues)
            }
          })
        }

        // Get collection data from the first path
        const collectionValues = { id: collectionId }
        if (paths && paths['@value'] && paths['@value'].length > 0) {
          const firstPath = paths['@value'][0]
          const { '@value': firstPathMap } = firstPath
          const firstPathPairs = fromPairs(chunk(firstPathMap, 2))

          if (firstPathPairs.end && firstPathPairs.end['@value']) {
            const endMap = firstPathPairs.end['@value']
            const endPairs = chunk(endMap, 2)

            endPairs.forEach((pair) => {
              const [key, value] = pair

              if (!isObject(key)) {
                const { '@value': valueMap } = value
                if (valueMap && Array.isArray(valueMap)) {
                  const [actualValue] = valueMap
                  collectionValues[key] = actualValue
                }
              }
            })
          }
        }

        // Add to collections list
        collectionsList.push({
          ...collectionValues,
          relationships: relationshipsArray,
          relationshipCount
        })
      })
    }
  }

  const returnObject = {
    count: totalRelatedCollectionsCount,
    items: collectionsList
  }

  // Useful for debugging!
  // console.log('graphDb.js response', JSON.stringify(returnObject, null, 2))

  return returnObject
}
