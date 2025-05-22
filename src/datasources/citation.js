import citationKeyMap from '../utils/umm/citationKeyMap.json'

import { parseRequestedFields } from '../utils/parseRequestedFields'
import Citation from '../cmr/concepts/citation'

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

export const deleteCitation = async (args, context, parsedInfo) => {
  const { header } = context

  const requestInfo = parseRequestedFields(parsedInfo, citationKeyMap, 'citation')

  const {
    ingestKeys
  } = requestInfo

  const citation = new Citation(header, requestInfo, args)

  // Contact CMR
  citation.delete(args, ingestKeys, header)

  // Parse the response from CMR
  await citation.parseDelete(requestInfo)

  // Return a formatted JSON response
  return citation.getFormattedDeleteResponse()
}
