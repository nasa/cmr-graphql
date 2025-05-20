import citationKeyMap from '../utils/umm/citationKeyMap.json'

import { parseRequestedFields } from "../utils/parseRequestedFields"
import Citation from '../cmr/concepts/citation'

export const fetchCitations =  async (params, context, parsedInfo) => {
  const { headers } = context
  const requestInfo = parseRequestedFields(parsedInfo, citationKeyMap, 'citation')

  const citation = new Citation(headers, requestInfo, params)

  citation.fetch(params)

  await citation.parse(requestInfo)

  return citation.getFormattedResponse()
}

export const deleteCitation = async (args, context, parsedInfo) => {
  const { header } = context 

  const requestInfo = parseRequestedFields(parsedInfo, citationKeyMap, 'citation')

  const {
    ingestKeys
  } = requestInfo

  const citation = new Citation(header, requestInfo, args)

  citation.delete(args, ingestKeys, header)

  await citation.parseDelete(requestInfo)

  return citation.getFormattedDeleteResponse()
}
