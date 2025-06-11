import chunk from 'lodash/chunk'
import fromPairs from 'lodash/fromPairs'

import { cmrGraphDb } from '../utils/cmrGraphDb'
import { getUserPermittedGroups } from '../utils/getUserPermittedGroups'
import { mergeParams } from '../utils/mergeParams'

/**
 * Queries CMR GraphDB for citations associated with collections.
 * @param {Object} source Source object containing id
 * @param {Object} params Search parameters for the citation search.
 * @param {Object} context GraphQL context containing headers and user info.
 * @param {Object} parsedInfo Parsed GraphQL query info.
 */
export default async (
  source,
  params,
  context
) => {
  const { conceptId } = source

  const { edlUsername, headers } = context

  // Merge nested 'params' object with existing parameters
  const queryParams = mergeParams(params)
  const {
    limit = 20,
    offset = 0,
    depth = 1,
    identifierType,
    relationshipType,
    providerId
  } = queryParams

  // Build filters based on requested citation properties
  const citationFilters = []

  let edgeTraversal = 'bothE()'
  if (relationshipType && relationshipType.length > 0) {
    edgeTraversal = `bothE('${relationshipType.join('\',\'')}')`
  }

  if (identifierType) {
    if (Array.isArray(identifierType)) {
      citationFilters.push(`has('identifierType', within('${identifierType.join('\',\'')}'))`)
    } else {
      citationFilters.push(`has('identifierType', '${identifierType}')`)
    }
  }

  if (providerId) {
    if (Array.isArray(providerId)) {
      citationFilters.push(`has('providerId', within('${providerId.join('\',\'')}'))`)
    } else {
      citationFilters.push(`has('providerId', '${providerId}')`)
    }
  }

  // Retrieve the user groups from EDL to filter the query
  const userGroups = await getUserPermittedGroups(headers, edlUsername)

  const query = JSON.stringify({
    gremlin: `
      g
      .V()
      .has('collection', 'id', '${conceptId}')
      .has('permittedGroups', within(${userGroups}))
      .repeat(
        ${edgeTraversal}
        .as('lastEdge')
        .otherV()
        .hasLabel('citation')
        ${citationFilters.length > 0 ? `.${citationFilters.join('.')}` : ''}
      )
      .times(${Math.min(depth, 3)})
      .emit()
      .dedup()
      .as('allCitations')
      .aggregate('totalCount')
      .project('citationData', 'associationLevel', 'relationshipType')
      .by(valueMap(true))
      .by(path().count(local).math('(_ - 1) / 2'))
      .by(select('lastEdge').label())
      .order()
      .by(select('citationData').select('title'), asc)
      .range(${offset}, ${offset + limit})
      .fold()
      .project('citations', 'totalCount')
      .by()
      .by(cap('totalCount').count(local))
    `
  })

  const { data } = await cmrGraphDb({
    conceptId,
    headers,
    query
  })

  const { result } = data

  // Useful for debugging!
  // console.log('GraphDB Citations query', JSON.parse(query))
  // console.log('GraphDB Citations Response result: ', JSON.stringify(result, null, 2))

  const { data: resultData } = result
  const { '@value': dataValues } = resultData
  const [responseMap] = dataValues
  const { '@value': responseMapValue } = responseMap
  const responseData = fromPairs(chunk(responseMapValue, 2))
  const { citations: citationsResult, totalCount: totalCountResult } = responseData
  const { '@value': totalCitationsCount } = totalCountResult
  const { '@value': citationsArray } = citationsResult

  const processedCitations = []

  // Process each citation from GraphDB
  citationsArray.forEach((citation) => {
    const { '@value': citationMapValues } = citation
    const citationData = fromPairs(chunk(citationMapValues, 2))

    const {
      citationData: rawCitationData,
      associationLevel,
      relationshipType: foundRelationshipType
    } = citationData
    const { '@value': citationProperties } = rawCitationData

    const parsedCitation = {}
    const citationPairs = chunk(citationProperties, 2)

    citationPairs.forEach(([keyObj, valueObj]) => {
      let key
      if (typeof keyObj === 'string') {
        key = keyObj
      } else if (keyObj && typeof keyObj === 'object' && '@value' in keyObj) {
        key = keyObj['@value']
      } else {
        return
      }

      let value
      if (valueObj && typeof valueObj === 'object' && '@value' in valueObj) {
        const rawValue = valueObj['@value']
        value = Array.isArray(rawValue) ? rawValue[0] : rawValue
      } else {
        value = valueObj
      }

      parsedCitation[key] = value
    })

    const formattedCitation = {
      id: parsedCitation.id || '',
      identifier: parsedCitation.identifier || '',
      identifierType: parsedCitation.identifierType || '',
      name: parsedCitation.name || '',
      title: parsedCitation.title || '',
      abstract: parsedCitation.abstract || '',
      providerId: parsedCitation.providerId || '',
      associationLevel: associationLevel['@value'],
      relationshipType: foundRelationshipType
    }

    processedCitations.push(formattedCitation)
  })

  const returnObject = {
    count: totalCitationsCount,
    items: processedCitations
  }

  // Useful for debugging!
  // console.log('GraphDB Associated Citations Response: ', JSON.stringify(returnObject, null, 2))

  return returnObject
}
