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
    limit = 10,
    offset = 0
  } = params

  const rangeStep = `.range(${offset}, ${offset + limit})`

  const query = JSON.stringify({
    gremlin: `
    g
    .V()
    .has('collection', 'id', '${conceptId}')
    .sideEffect(
      bothE()
      .inV()
      .bothE()
      .outV()
      .hasLabel('collection')
      .simplePath()
      .count()
      .store('count')
    )
    .bothE()
    .inV()
    .bothE()
    .outV()
    .hasLabel('collection')
    .simplePath()
    ${rangeStep}
    .path()
    .by(valueMap(true))
    .as('values')
    .select('values', 'count')
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
  let count

  dataValues.forEach((dataValue) => {
    const { '@value': dataValueMap } = dataValue
    const { values: value, count: countMap } = fromPairs(chunk(dataValueMap, 2))

    // Parse the count object
    const { '@value': countValueMap } = countMap;

    // The first value returned holds the total count
    ([{ '@value': count }] = countValueMap)


    // Parse the collection values
    const { '@value': valueMap } = value
    const { objects } = valueMap
    const { '@value': objectValueMap } = objects

    // objectValueMap[0] is starting collection vertex
    // objectValueMap[1] is the edge going out of the starting collection vertex
    // objectValueMap[2] is relationship vertex (campaign, documenation, platformInstrument)
    // objectValueMap[3] is the edge going out of the relationship vertex
    // objectValueMap[4] is related collection vertex

    // Parse the relationship vertex (objectValueMap[2]) for values
    const { '@value': relationshipVertexMap } = objectValueMap[2]
    const relationshipVertexPairs = chunk(relationshipVertexMap, 2)
    let relationshipLabel
    const relationshipVertexValues = {}
    relationshipVertexPairs.forEach((pair) => {
      const [key, value] = pair

      if (isObject(key)) {
        const { '@value': keyMap } = key

        if (keyMap === 'label') {
          relationshipLabel = value
        }

        return
      }

      const { '@value': relationshipVertexValueMap } = value

      const [relationshipVertexValue] = relationshipVertexValueMap
      relationshipVertexValues[key] = relationshipVertexValue
    })

    // Parse the related collection vertex (objectValueMap[4]) for values
    const { '@value': relatedCollectionVertexMap } = objectValueMap[4]
    const relatedCollectionVertexPairs = chunk(relatedCollectionVertexMap, 2)
    const relatedCollectionValues = {}
    relatedCollectionVertexPairs.forEach((pair) => {
      const [key, value] = pair

      if (isObject(key)) {
        return
      }

      const { '@value': relatedCollectionVertexValueMap } = value

      const [relatedCollectionVertexValue] = relatedCollectionVertexValueMap
      relatedCollectionValues[key] = relatedCollectionVertexValue
    })

    // Push the data onto the collectionsList to be returned to the resolver
    collectionsList.push({
      ...relatedCollectionValues,
      relationship: relationshipLabel,
      ...relationshipVertexValues
    })
  })

  return {
    count,
    items: collectionsList
  }
}
