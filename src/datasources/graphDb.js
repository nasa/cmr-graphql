import {
  camelCase,
  chunk,
  fromPairs
} from 'lodash'
import { cmrGraphDb } from '../utils/cmrGraphDb'

/**
 * Creates the traversal needed to return the documentedWith relationships.
 * @param {Object} params Query parameters passed in from the resolver.
 * @param {String} param0.name GraphDB `documentation` vertex name property to use for filtering.
 * @param {String} param0.title GraphDB `documentation` vertex title property to use for filtering.
 * @param {Integer} param0.limit Limit parameter used to create the range step in the traversal.
 * @param {Integer} param0.offset Offset parameter used to create the range step in the traversal.
 */
const documentedWithTraversal = (params) => {
  const {
    url,
    title,
    limit = 5,
    offset = 0
  } = params

  let filterStep = ''
  if (url) {
    filterStep += `.has("documentation", "url", "${url}")`
  }
  if (title) {
    filterStep += `.has("documentation", "title", "${title}")`
  }

  const rangeStep = `.range(${offset}, ${offset + limit})`

  return `
  .outE('documentedBy')
  .inV()
  ${filterStep}
  .project('collections', 'documentedWith')
  .by(inE('documentedBy')
    .outV()
    .hasLabel('collection')
    .where(neq('initialVertex'))
    ${rangeStep}
    .valueMap()
    .fold()
  )
  .by(valueMap())
  `
}

/**
 * Creates the traversal needed to return the campaignedWith relationships.
 * @param {Object} params Query parameters passed in from the resolver.
 * @param {String} param0.name GraphDB `campaign` vertex name property to use for filtering.
 * @param {Integer} param0.limit Limit parameter used to create the range step in the traversal.
 * @param {Integer} param0.offset Offset parameter used to create the range step in the traversal.
 */
const campaignedWithTraversal = (params) => {
  const {
    name,
    limit = 5,
    offset = 0
  } = params

  let filterStep = ''
  if (name) {
    filterStep += `.has("campaign", "name", "${name}")`
  }

  const rangeStep = `.range(${offset}, ${offset + limit})`

  return `
  .outE('includedIn')
  .inV()
  ${filterStep}
  .project('collections', 'campaignedWith')
  .by(inE('includedIn')
    .outV()
    .hasLabel('collection')
    .where(neq('initialVertex'))
    ${rangeStep}
    .valueMap()
    .fold()
  )
  .by(valueMap())
  `
}

/**
 * Creates the traversal needed to return the campaignedWith relationships.
 * @param {Object} params Query parameters passed in from the resolver.
 * @param {String} param0.platform GraphDB `platformInstrument` vertex platform property to use for filtering.
 * @param {String} param0.instrument GraphDB `platformInstrument` vertex instrument property to use for filtering.
 * @param {Integer} param0.limit Limit parameter used to create the range step in the traversal.
 * @param {Integer} param0.offset Offset parameter used to create the range step in the traversal.
 */
const acquiredWithTraversal = (params) => {
  const {
    platform,
    instrument,
    limit = 5,
    offset = 0
  } = params

  let filterStep = ''
  if (platform) {
    filterStep += `.has("platformInstrument", "platform", "${platform}")`
  }
  if (instrument) {
    filterStep += `.has("platformInstrument", "instrument", "${instrument}")`
  }

  const rangeStep = `.range(${offset}, ${offset + limit})`

  return `
  .outE('acquiredBy')
  .inV()
  ${filterStep}
  .project('collections', 'acquiredWith')
  .by(inE('acquiredBy')
    .outV()
    .hasLabel('collection')
    .where(neq('initialVertex'))
    ${rangeStep}
    .valueMap()
    .fold()
  )
  .by(valueMap())
  `
}

/**
 * Queries CMR GraphDB for related collections.
 * @param {String} conceptId ConceptID for the initial collection to find relationships on.
 * @param {String} type Relationship type to search for. `documentedWith`, `campaignedWith` or `acquiredWith`.
 * @param {String} params Search parameters for the relationship search.
 * @param {String} headers Headers to be passed to CMR.
 * @param {String} groupBy Group by parameter for grouping the relationship results. `collection` or `value`.
 */
export default async (
  conceptId,
  type,
  params,
  headers,
  groupBy
) => {
  let traversal

  if (type === 'documentedWith') {
    traversal = documentedWithTraversal(params)
  }
  if (type === 'campaignedWith') {
    traversal = campaignedWithTraversal(params)
  }
  if (type === 'acquiredWith') {
    traversal = acquiredWithTraversal(params)
  }

  // Query CMR GraphDB for the provided conceptId's relationships
  const query = JSON.stringify({
    gremlin: `
    g
    .V()
    .has('collection', 'id', '${conceptId}')
    .as('initialVertex')
    ${traversal}
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
  const { '@value': values } = resultData

  const relationshipByCollectionMap = {}
  const relationshipByValueList = []

  values.forEach((value) => {
    const { '@value': valueMap } = value
    const valuesMap = fromPairs(chunk(valueMap, 2))

    const {
      collections: collectionResults,
      [type]: relationshipResults
    } = valuesMap

    // Minimize collection list down to array of collection objects
    const { '@value': collectionList } = collectionResults

    const collections = collectionList.map((collectionListItem) => {
      const { '@value': collectionValues } = collectionListItem
      const collectionStuff = fromPairs(chunk(collectionValues, 2))

      const collection = {
        type: 'collection'
      }

      Object.keys(collectionStuff).forEach((key) => {
        const { '@value': [value] } = collectionStuff[key]
        collection[camelCase(key)] = value
      })

      return collection
    })

    // Parse the relationshipResults down to simple objects of relationship values
    //
    // This list: [
    //   'instrument',
    //   { '@type': 'g:List', '@value': [ 'VISSR' ] },
    //   'platform',
    //   { '@type': 'g:List', '@value': [ 'METEOSAT-7' ] }
    // ]
    // will become this object: {
    //   instrument: 'VISSR',
    //   platform: 'METEOSAT-7'
    // }
    //
    // This list:
    // [ 'name', { '@type': 'g:List', '@value': [ 'Project2' ] } ]
    // will become this object:
    // { name: 'Project2' }
    const relationshipValues = {}

    const { '@value': valueMappingList } = relationshipResults
    const valueMapping = fromPairs(chunk(valueMappingList, 2))

    Object.keys(valueMapping).forEach((key) => {
      const { '@value': values } = valueMapping[key]
      relationshipValues[key] = values.join()
    })


    // Map the relationshipValues and collection to an object keyed with the collection conceptId
    if (groupBy === 'collection') {
      collections.forEach((collection) => {
        const { id: conceptId } = collection
        if (!relationshipByCollectionMap[conceptId]) {
          relationshipByCollectionMap[conceptId] = {
            items: []
          }
        }

        relationshipByCollectionMap[conceptId].items.push({
          ...relationshipValues,
          type
        })
        relationshipByCollectionMap[conceptId].group = {
          ...collection,
          type: 'collection'
        }
      })
    }

    // Add the relationshipValues and collections onto the relationshipByValueList to be returned
    if (groupBy === 'value') {
      relationshipByValueList.push({
        group: {
          ...relationshipValues,
          type
        },
        items: collections
      })
    }
  })

  // Turn the relationshipByCollectionMap into an array and return
  if (groupBy === 'collection') {
    const relationshipByCollectionList = []

    Object.keys(relationshipByCollectionMap).forEach((conceptId) => {
      relationshipByCollectionList.push({
        ...relationshipByCollectionMap[conceptId]
      })
    })

    return relationshipByCollectionList
  }

  // Return the relationshipByValueList
  // if groupBy is value
  return relationshipByValueList
}
