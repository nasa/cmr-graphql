import citationKeyMap from '../utils/umm/citationKeyMap.json'
import Citation from '../cmr/concepts/citation'

import { cmrQuery } from '../utils/cmrQuery'
import { findPreviousRevision } from '../utils/findPreviousRevision'
import { getProviderFromConceptId } from '../utils/getProviderFromConceptId'
import { parseRequestedFields } from '../utils/parseRequestedFields'

export const fetchCitations = async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, citationKeyMap, 'citation')

  const citation = new Citation(headers, requestInfo, params)

  // Query CMR
  citation.fetch(params)

  // Parse the response from CMR
  await citation.parse(requestInfo)

  // Return a formatted JSON response
  return citation.getFormattedResponse()
}

export const restoreCitationRevision = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, citationKeyMap, 'citation')

  const {
    ingestKeys
  } = requestInfo

  const citation = new Citation(headers, requestInfo, args)

  const {
    conceptId,
    revisionId
  } = args

  const previousRevisions = await cmrQuery({
    conceptType: 'citations',
    options: {
      format: 'umm_json'
    },
    params: {
      conceptId,
      allRevisions: true
    }
  })

  const { data: responseData } = previousRevisions

  // Find the requested revision for the provided concept
  const previousRevision = findPreviousRevision(responseData, revisionId)

  const { meta, umm } = previousRevision

  const { 'native-id': nativeId } = meta

  // Query CMR
  citation.ingest({
    nativeId,
    providerId: getProviderFromConceptId(conceptId),
    ...umm
  }, ingestKeys, headers)

  // Parse the response from CMR
  await citation.parseIngest(requestInfo)

  // Return a formatted JSON response
  return citation.getFormattedIngestResponse()
}

export const deleteCitation = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, citationKeyMap, 'citation')

  const {
    ingestKeys
  } = requestInfo

  const citation = new Citation(headers, requestInfo, args)

  // Contact CMR
  citation.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await citation.parseDelete(requestInfo)

  // Return a formatted JSON response
  return citation.getFormattedDeleteResponse()
}
