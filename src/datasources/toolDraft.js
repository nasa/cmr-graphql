import { parseRequestedFields } from '../utils/parseRequestedFields'

import toolDraftKeyMap from '../utils/umm/toolDraftKeyMap.json'

import ToolDraft from '../cmr/concepts/toolDraft'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, toolDraftKeyMap, 'toolDraft')

  const toolDraft = new ToolDraft(headers, requestInfo, params)

  // Query MMT
  toolDraft.fetch(params)

  // Parse the response from MMT
  await toolDraft.parse(requestInfo, params)

  // Return a formatted JSON response
  return toolDraft.getFormattedResponse()
}
