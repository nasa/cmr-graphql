import {
  chunk,
  fromPairs,
  isObject
} from 'lodash'

import { cmrGraphDb } from '../utils/cmrGraphDb'

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
) => {
  const {
    limit = 20,
    offset = 0,
    relatedUrlSubType,
    relatedUrlType
  } = params

  const relatedUrlFilters = []
  let filters = ''

  // Filter the relationship vertexes based on GraphQL query parameters
  if (relatedUrlType && !relatedUrlSubType) {
    relatedUrlFilters.push(`has('relatedUrl', 'type', within('${relatedUrlType.join('\',\'')}'))`)
  }
  if (relatedUrlSubType && !relatedUrlType) {
    relatedUrlFilters.push(`has('relatedUrl', 'subType', within("${relatedUrlSubType.join('","')}"))`)
  }
  // If both type and subType are provided we need to AND those params together, while still ORing the other relationship vertex types
  if (relatedUrlType && relatedUrlSubType) {
    relatedUrlFilters.push(`
      and(
        has('relatedUrl', 'type', within('${relatedUrlType.join('\',\'')}')),
        has('relatedUrl', 'subType', within("${relatedUrlSubType.join('","')}"))
      )
    `)
  }

  if (relatedUrlFilters.length > 0) {
    // If relatedUrl filters exist, we need to OR those filters `not(hasLabel('relatedUrl'))`
    // This will include all other relationships, and only filter the relatedUrl relationships
    filters = `
    .or(
      ${relatedUrlFilters.join()},
      not(hasLabel('relatedUrl'))
    )
    `
  }

  const query = JSON.stringify({
    gremlin: `
    g
    .V()
    .has('collection', 'id', '${conceptId}')
    .bothE()
    .inV()
    ${filters}
    .bothE()
    .outV()
    .hasLabel('collection')
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

  return {
    count: totalRelatedCollectionsCount,
    items: collectionsList
  }
}
