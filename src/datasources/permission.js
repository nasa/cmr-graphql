import { parseRequestedFields } from '../utils/parseRequestedFields'

import Permission from '../cmr/concepts/permission'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, {}, 'permission')

  const permission = new Permission(headers, requestInfo, params)

  // Query CMR
  permission.fetch(params)

  // Parse the response from CMR
  await permission.parse(requestInfo)

  // Return a formatted JSON response
  return permission.getFormattedResponse()
}
