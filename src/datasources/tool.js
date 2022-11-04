import { parseRequestedFields } from '../utils/parseRequestedFields'

import toolKeyMap from '../utils/umm/toolKeyMap.json'

import Tool from '../cmr/concepts/tool'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, toolKeyMap, 'tool')

  const tool = new Tool(headers, requestInfo, params)

  // Query CMR
  tool.fetch(params)

  // Parse the response from CMR
  await tool.parse(requestInfo)

  // Return a formatted JSON response
  return tool.getFormattedResponse()
}
