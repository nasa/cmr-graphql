import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionDraftKeyMap from '../utils/umm/collectionDraftKeyMap.json'

import CollectionDraft from '../cmr/concepts/collectionDraft'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, collectionDraftKeyMap, 'collectionDraft')

  const collectionDraft = new CollectionDraft(headers, requestInfo, params)

  // Query MMT
  collectionDraft.fetch(params)

  // Parse the response from MMT
  await collectionDraft.parse(requestInfo, params)

  // Return a formatted JSON response
  return collectionDraft.getFormattedResponse()
}
