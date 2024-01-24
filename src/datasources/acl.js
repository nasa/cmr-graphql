import { parseRequestedFields } from '../utils/parseRequestedFields'

import aclKeyMap from '../utils/umm/aclKeyMap.json'
import collectionKeyMap from '../utils/umm/collectionKeyMap.json'
import Acl from '../cmr/concepts/acl'

export default async (params, context, parsedInfo) => {
  const { headers } = context
  console.log('I am datasourxce acl 1')
  // console.log('🚀🚀I am parsedInfo:', parsedInfo.fieldsByTypeName.AclList.items.fieldsByTypeName.AclItem)
  
  //const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  const requestInfo = parseRequestedFields(parsedInfo, aclKeyMap, 'acl')

  console.log('I am datasourxce acl 2')

  const acl = new Acl(headers, requestInfo, params)
  //aclSource(args, context, parseResolveInfo(info))

  // const acl = new Acl(headers, params)

  console.log('@@@acl3')
  // // Query CMR
  acl.fetch(params)

  console.log('@@@acl4🚀🚀', requestInfo)

  // Parse the response from CMR
  await acl.parse(requestInfo)

  console.log('@@@acl.parse(requestInfo) datasources', acl)

  // Return a formatted JSON response
  return acl.getFormattedResponse()
}