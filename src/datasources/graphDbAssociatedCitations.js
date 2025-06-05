import chunk from 'lodash/chunk'
import fromPairs from 'lodash/fromPairs'

import { cmrGraphDb } from '../utils/cmrGraphDb'
import { fetchCitations } from './citation'
import { getUserPermittedGroups } from '../utils/getUserPermittedGroups'
import { mergeParams } from '../utils/mergeParams'

/**
 * Queries CMR GraphDB for citations associated with collections.
 * @param {Object} source Source object containing conceptId
 * @param {Object} params Search parameters for the citation search.
 * @param {Object} context GraphQL context containing headers and user info.
 * @param {Object} parsedInfo Parsed GraphQL query info.
 */
export default async (
  source,
  params,
  context,
  parsedInfo
) => {
  const { fieldsByTypeName } = parsedInfo
  const { CitationList: citationFields } = fieldsByTypeName

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

  let edgeTraversal = '.bothE()'
  if (relationshipType && relationshipType.length > 0) {
    edgeTraversal = `.bothE('${relationshipType.join('\',\'')}')`
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

  // Build traversal path based on depth - citations are connected through relationship vertices
  const traversalStep = `${edgeTraversal}.otherV().hasLabel('citation')`
  let depthTraversal = traversalStep.repeat(Math.min(depth, 3))

  // Apply citation filters to the traversal if any exist
  if (citationFilters.length > 0) {
    depthTraversal += `.${citationFilters.join('.')}`
  }

  // Retrieve the user groups from EDL to filter the query
  const userGroups = await getUserPermittedGroups(headers, edlUsername)

  const query = JSON.stringify({
    gremlin: `
    g
    .V()
    .has('collection', 'id', '${conceptId}')
    .has('permittedGroups', within(${userGroups}))
    ${depthTraversal}
    .dedup()
    .as('allCitations')
    .aggregate('totalCount')
    .project('citationData', 'associationLevel')
    .by(valueMap(true))
    .by(constant(${depth}))
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

  const requestedCitationFields = Object.keys(citationFields.items.fieldsByTypeName.Citation)

  const cmrOnlyFields = ['resolutionAuthority', 'relatedIdentifiers', 'citationMetadata', 'scienceKeywords', 'nativeId']

  const needsCmrData = requestedCitationFields.some((field) => cmrOnlyFields.includes(field))

  const { data: resultData } = result
  const { '@value': dataValues } = resultData
  const [responseMap] = dataValues
  const { '@value': responseMapValue } = responseMap
  const responseData = fromPairs(chunk(responseMapValue, 2))
  const { citations: citationsResult, totalCount: totalCountResult } = responseData
  const { '@value': totalCitationsCount } = totalCountResult
  const { '@value': citationsArray } = citationsResult

  let processedCitations = []

  // Process each citation from GraphDB
  citationsArray.forEach((citation) => {
    const { '@value': citationMapValues } = citation
    const citationData = fromPairs(chunk(citationMapValues, 2))

    const { citationData: rawCitationData, associationLevel } = citationData
    const { '@value': citationProperties } = rawCitationData

    const parsedCitation = {}
    const citationPairs = chunk(citationProperties, 2)

    citationPairs.forEach(([key, value]) => {
      if (typeof key === 'string') {
        const [firstValue] = value['@value']
        parsedCitation[key] = firstValue
      }
    })

    const formattedCitation = {
      conceptId: parsedCitation.id || '',
      identifier: parsedCitation.identifier || '',
      identifierType: parsedCitation.identifierType || '',
      name: parsedCitation.name || '',
      abstract: parsedCitation.abstract || '',
      providerId: parsedCitation.providerId || '',
      associationLevel: associationLevel['@value']
    }

    processedCitations.push(formattedCitation)
  })

  // If CMR data is needed, fetch full citation data
  if (needsCmrData && processedCitations.length > 0) {
    const conceptIds = processedCitations.map((citation) => citation.conceptId)

    const cmrCitations = await fetchCitations({
      conceptId: conceptIds
    }, context, parsedInfo)

    // Merge CMR data with GraphDB association metadata
    processedCitations = processedCitations.map((graphDbCitation) => {
      const cmrCitation = cmrCitations.items.find(
        (cmr) => cmr.conceptId === graphDbCitation.conceptId
      )

      // Merge CMR data with GraphDB metadata, keeping association info
      return {
        ...cmrCitation,
        associationLevel: graphDbCitation.associationLevel
      }
    })

    const returnObject = {
      count: totalCitationsCount,
      items: processedCitations
    }
    // Useful for debugging!
    // console.log('GraphDB Associated Citations Response: ', JSON.stringify(returnObject, null, 2))

    return returnObject
  }

  const returnObject = {
    count: totalCitationsCount,
    items: processedCitations
  }
  // Useful for debugging!
  // console.log('GraphDB Associated Citations Response: ', JSON.stringify(returnObject, null, 2))

  return returnObject
}
