import { parseRequestedFields } from '../utils/parseRequestedFields'

import revisionKeyMap from '../utils/umm/revisionKeyMap.json'

import Revision from '../cmr/concepts/revision'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, revisionKeyMap, 'revision')

  const revision = new Revision(headers, requestInfo, params)

  // Query CMR
  revision.fetch(params)

  // Parse the response from CMR
  await revision.parse(requestInfo)
  //   Console.log("🚀 ~ revision:", revision)

  // console.log(revision.getFormattedResponse())
  // Return a formatted JSON response
  return revision.getFormattedResponse()
}
