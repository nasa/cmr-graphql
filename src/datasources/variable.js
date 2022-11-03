import { parseRequestedFields } from '../utils/parseRequestedFields'

import variableKeyMap from '../utils/umm/variableKeyMap.json'

import Variable from '../cmr/concepts/variable'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, variableKeyMap, 'variable')

  const variable = new Variable(headers, requestInfo, params)

  // Query CMR
  variable.fetch(params)

  // Parse the response from CMR
  await variable.parse(requestInfo)

  // Return a formatted JSON response
  return variable.getFormattedResponse()
}
