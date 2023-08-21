import DraftConcept from '../cmr/concepts/draftConcept'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import serviceDraftKeyMap from '../utils/umm/serviceDraftKeyMap.json'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, serviceDraftKeyMap, 'serviceDraft')

  const serviceDraft = new DraftConcept(headers, requestInfo, params, 'serviceDraft')

  // Query MMY
  serviceDraft.fetch(params)

  // Parse the response from MMT
  await serviceDraft.parse(requestInfo, params)

  // Return a formatted JSON response
  return serviceDraft.getFormattedResponse()
}
