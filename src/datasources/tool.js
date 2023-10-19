import { parseRequestedFields } from '../utils/parseRequestedFields'

import toolKeyMap from '../utils/umm/toolKeyMap.json'

import Tool from '../cmr/concepts/tool'

export const fetchTools = async (params, context, parsedInfo) => {
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

export const deleteTool = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, toolKeyMap, 'tool')

  const {
    ingestKeys
  } = requestInfo

  const tool = new Tool(headers, requestInfo, args)

  // Contact CMR
  tool.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await tool.parseDelete(requestInfo)

  // Return a formatted JSON response
  return tool.getFormattedDeleteResponse()
}
