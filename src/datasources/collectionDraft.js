import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionDraftKeyMap from '../utils/umm/collectionDraftKeyMap.json'

import DraftConecpt from '../cmr/concepts/draftConcept'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, collectionDraftKeyMap, 'collectionDraft')

  const collectionDraft = new DraftConecpt(headers, requestInfo, params, 'collectionDraft')

  // Query MMT
  collectionDraft.fetch(params)

  // Parse the response from MMT
  await collectionDraft.parse(requestInfo, params)

  // Return a formatted JSON response
  return collectionDraft.getFormattedResponse()
}
