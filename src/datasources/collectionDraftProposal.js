import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionDraftProposalKeyMap from '../utils/umm/collectionDraftProposalKeyMap.json'

import CollectionDraftProposal from '../cmr/concepts/collectionDraftProposal'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, collectionDraftProposalKeyMap, 'collectionDraftProposal')

  const collectionDraftProposal = new CollectionDraftProposal(headers, requestInfo, params)

  // Query Draft MMT
  collectionDraftProposal.fetch(params)

  // Parse the response from Draft MMT
  await collectionDraftProposal.parse(requestInfo, params)

  // Return a formatted JSON response
  return collectionDraftProposal.getFormattedResponse()
}
