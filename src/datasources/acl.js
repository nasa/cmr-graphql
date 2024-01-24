import { parseRequestedFields } from '../utils/parseRequestedFields'

import aclKeyMap from '../utils/umm/aclKeyMap.json'
import collectionKeyMap from '../utils/umm/collectionKeyMap.json'
import Acl from '../cmr/concepts/acl'

export default async (params, context, parsedInfo) => {
  console.log('🚀 ~ parsedInfo:', parsedInfo)
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, aclKeyMap, 'acl')

  console.log('about to ACL class')
  const acl = new Acl(headers, requestInfo, params)

  // // Query CMR
  acl.fetch(params)

  // Parse the response from CMR
  await acl.parse(requestInfo)
  // Console.log('  return acl.getFormattedResponse()', acl.getFormattedResponse())

  // Return a formatted JSON response
  return acl.getFormattedResponse()
}
