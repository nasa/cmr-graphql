import {
  chunk,
  fromPairs,
  isObject
} from 'lodash'

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
  conceptId,
  params,
  headers,
  parsedInfo,
  edlUsername
) => {
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
    offset = 0,
    relatedUrlSubtype,
    relatedUrlType
  } = queryParams

  const relatedUrlFilters = []
  let filters = ''

  const includedLabels = []
  if (Object.keys(relationshipsFields).includes('GraphDbProject')) {
    includedLabels.push('project')
  }
  if (Object.keys(relationshipsFields).includes('GraphDbPlatformInstrument')) {
    includedLabels.push('platformInstrument')
  }
  if (Object.keys(relationshipsFields).includes('GraphDbRelatedUrl')) {
    includedLabels.push('relatedUrl')
  }

  const relationshipTypeRequested = Object.keys(relationshipFields).includes('relationshipType')

  if (
    includedLabels.includes('relatedUrl')
    && (relatedUrlType || relatedUrlSubtype)
  ) {
    // If the relatedUrl type was requested, filter relatedUrls based on the GraphQL query parameters
    if (relatedUrlType && !relatedUrlSubtype) {
      relatedUrlFilters.push(`has('relatedUrl', 'type', within('${relatedUrlType.join('\',\'')}'))`)
    }
    if (relatedUrlSubtype && !relatedUrlType) {
      relatedUrlFilters.push(`has('relatedUrl', 'subtype', within("${relatedUrlSubtype.join('","')}"))`)
    }
    // If both type and subtype are provided we need to AND those params together, while still ORing the other relationship vertex types
    if (relatedUrlType && relatedUrlSubtype) {
      relatedUrlFilters.push(`
        and(
          has('relatedUrl', 'type', within('${relatedUrlType.join('\',\'')}')),
          has('relatedUrl', 'subtype', within("${relatedUrlSubtype.join('","')}"))
        )
      `)
    }

    // Need to OR the relatedUrl filters with the other labels requested
    const otherLabels = includedLabels.filter((label) => label !== 'relatedUrl')
    if (relationshipTypeRequested) {
      filters = `
      .or(
        ${relatedUrlFilters.join()},
        hasLabel('project','platformInstrument')
      )
      `
    } else if (otherLabels.length > 0) {
      filters = `
      .or(
        ${relatedUrlFilters.join()},
        hasLabel('${otherLabels.join("','")}')
      )
      `
    } else {
      filters = `.${relatedUrlFilters.join()}`
    }
  } else if (includedLabels.length === 0 || relationshipTypeRequested) {
    // If no relationship labels are included or if relationshipType was requested, filter by all relationships
    filters = ".hasLabel('project','platformInstrument','relatedUrl')"
  } else {
    // Default to returning all values for those relationship labels that were requested
    filters = `
      .hasLabel('${includedLabels.join("','")}')
    `
  }
  // Retrieve the user groups from EDL to filter the query
  const userGroups = await getUserPermittedGroups(headers, edlUsername)

  const query = JSON.stringify({
    gremlin: `
    g
    .V()
    .has('collection', 'id', '${conceptId}')
    .has('permittedGroups', within(${userGroups}))
    .bothE()
    .inV()
    ${filters}
    .bothE()
    .outV()
    .hasLabel('collection')
    .has('permittedGroups', within(${userGroups}))
    .has('id',neq('${conceptId}'))
    .group()
    .by('id')
    .by(
      simplePath()
      .path()
      .by(valueMap(true))
      .fold()
      .as('pathValues')
      .project('relationshipValues', 'relationshipCount')
      .by(select('pathValues'))
      .by(
        unfold()
        .count()
      )
    )
    .order(local)
    .by(
      select(values)
      .select('relationshipCount'), desc
    )
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

    // The first value returned holds the total count
    ([{ '@value': totalRelatedCollectionsCount }] = totalRelatedCollectionsMap)

    // Parse the collection values
    const { '@value': relatedCollectionsList } = relatedCollectionsBulkSet
    const [{ '@value': relatedCollectionsMap }] = relatedCollectionsList

    relatedCollectionsMap.forEach((relatedCollectionMap) => {
      const { '@value': relatedCollectionMapValues } = relatedCollectionMap
      const [, conceptIdMapping] = relatedCollectionMapValues
      const { '@value': conceptIdMappingValues } = conceptIdMapping

      const {
        relationshipValues: relationshipValuesList
      } = fromPairs(chunk(conceptIdMappingValues, 2))

      const { '@value': relationshipValues } = relationshipValuesList

      const relationships = []
      const relatedCollectionValues = {}

      relationshipValues.forEach((relationshipValue) => {
        const { '@value': relationshipPathValue } = relationshipValue
        const { objects } = relationshipPathValue

        const { '@value': objectValueList } = objects

        // objectValueList[0] is starting collection vertex
        // objectValueList[1] is the edge going out of the starting collection vertex
        // objectValueList[2] is relationship vertex (project, documenation, platformInstrument)
        // objectValueList[3] is the edge going out of the relationship vertex
        // objectValueList[4] is related collection vertex

        // Parse the relationship vertex (objectValueList[2]) for values
        const { '@value': relationshipVertexMap } = objectValueList[2]
        const relationshipVertexPairs = chunk(relationshipVertexMap, 2)
        let relationshipLabel
        const relationshipVertexValues = {}
        relationshipVertexPairs.forEach((pair) => {
          const [key, value] = pair

          if (isObject(key)) {
            const { '@value': keyMap } = key

            if (keyMap === 'label') {
              relationshipLabel = value
              relationshipVertexValues.relationshipType = relationshipLabel
            }

            return
          }

          const { '@value': relationshipVertexValueMap } = value

          const [relationshipVertexValue] = relationshipVertexValueMap
          relationshipVertexValues[key] = relationshipVertexValue
        })
        relationships.push(relationshipVertexValues)

        // Parse the related collection vertex (objectValueList[4]) for values
        const { '@value': relatedCollectionVertexMap } = objectValueList[4]
        const relatedCollectionVertexPairs = chunk(relatedCollectionVertexMap, 2)
        relatedCollectionVertexPairs.forEach((pair) => {
          const [key, value] = pair

          if (isObject(key)) {
            return
          }

          const { '@value': relatedCollectionVertexValueMap } = value

          const [relatedCollectionVertexValue] = relatedCollectionVertexValueMap
          relatedCollectionValues[key] = relatedCollectionVertexValue
        })
      })

      // Push the data onto the collectionsList to be returned to the resolver
      collectionsList.push({
        ...relatedCollectionValues,
        relationships
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
