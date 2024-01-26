import { parseRequestedFields } from '../utils/parseRequestedFields'

import aclKeyMap from '../utils/umm/aclKeyMap.json'
import Acl from '../cmr/concepts/acl'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, aclKeyMap, 'acl')

  const acl = new Acl(headers, requestInfo, params)

  // // // Query CMR
  acl.fetch(params)

  // // Parse the response from CMR
  await acl.parse(requestInfo)
  console.log('acl', acl.getFormattedResponse())

  // // Return a formatted JSON response
  return acl.getFormattedResponse()
}
