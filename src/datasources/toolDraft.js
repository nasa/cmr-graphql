import { parseRequestedFields } from '../utils/parseRequestedFields'

import toolDraftKeyMap from '../utils/umm/toolDraftKeyMap.json'

import DraftConecpt from '../cmr/concepts/draftConcept'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, toolDraftKeyMap, 'toolDraft')

  const toolDraft = new DraftConecpt(headers, requestInfo, params, 'toolDraft')
  // Query MMT
  toolDraft.fetch(params)

  // Parse the response from MMT
  await toolDraft.parse(requestInfo, params)

  // Return a formatted JSON response
  return toolDraft.getFormattedResponse()
}
