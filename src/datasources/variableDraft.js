import { parseRequestedFields } from '../utils/parseRequestedFields'

import variableDraftKeyMap from '../utils/umm/variableDraftKeyMap.json'

import DraftConcept from '../cmr/concepts/draftConcept'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, variableDraftKeyMap, 'variableDraft')

  const variableDraft = new DraftConcept(headers, requestInfo, params, 'variableDraft')

  // Query MMT
  variableDraft.fetch(params)

  // Parse the response from MMT
  await variableDraft.parse(requestInfo, params)

  // Return a formatted JSON response
  return variableDraft.getFormattedResponse()
}
