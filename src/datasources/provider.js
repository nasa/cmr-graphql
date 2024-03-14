import { parseRequestedFields } from '../utils/parseRequestedFields'
import providerKeyMap from '../utils/umm/providerKeyMap.json'

import Provider from '../cmr/concepts/provider'

export default async (params, context, parsedInfo) => {
  const { headers } = context
  const requestInfo = parseRequestedFields(parsedInfo, providerKeyMap, 'provider')
  const provider = new Provider(headers, requestInfo, params)
  // Query CMR
  provider.fetch(params)

  // Parse the response from CMR
  await provider.parse(requestInfo)

  // Return a formatted JSON response
  return provider.getFormattedResponse()
}
