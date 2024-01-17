import { parseRequestedFields } from '../utils/parseRequestedFields'
import Acl from '../cmr/concepts/acl'

export const fetchAcl = async (params, context, parsedInfo) => {
  const { headers } = context

    
  const requestInfo = parseRequestedFields(parsedInfo,'Acl')

  const acl = new Acl(headers, requestInfo, params)

  //Query CMR
  acl.fetch(params)

  //Parse the response from CMR
  await acl.parse(requestInfo)

  //Return a formatted JSON response
  return acl.getFormattedResponse()
}