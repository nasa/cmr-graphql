import { parseRequestedFields } from '../utils/parseRequestedFields'

import revisionKeyMap from '../utils/umm/revisionKeyMap.json'

import Revision from '../cmr/concepts/revision'

export default async (conceptType, params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, revisionKeyMap, 'revision')

  const revision = new Revision(conceptType, headers, requestInfo, params)

  // Query CMR
  revision.fetch(params)

  // Parse the response from CMR
  await revision.parse(requestInfo)

  // Return a formatted JSON response
  return revision.getFormattedResponse()
}
