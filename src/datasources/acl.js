import { parseRequestedFields } from '../utils/parseRequestedFields'

import aclKeyMap from '../utils/umm/aclKeyMap.json'

import Acl from '../cmr/concepts/acl'

export default async (params, context, parsedInfo) => {
  const { headers } = context
  console.log('I am datasourxce acl 1')
  
  //const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  // const requestInfo = parseRequestedFields(parsedInfo, aclKeyMap, 'acl')

  console.log('I am datasourxce acl 2')

  //const acl = new Acl(headers, requestInfo, params)

  const acl = new Acl(headers, params)

  console.log('@@@acl3')
  // Query MMT
  acl.fetch(params)

  console.log('@@@acl4')

  // Parse the response from MMT
  // await acl.parse(requestInfo)

  console.log('@@@acl5')

  // Return a formatted JSON response
  return acl.getFormattedResponse()
}