import { cmrQuery } from '../utils/cmrQuery'
import { findPreviousRevision } from '../utils/findPreviousRevision'
import { getProviderFromConceptId } from '../utils/getProviderFromConceptId'
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

export const restoreToolRevision = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, toolKeyMap, 'tool')

  const {
    ingestKeys
  } = requestInfo

  const tool = new Tool(headers, requestInfo, args)

  const {
    conceptId,
    revisionId
  } = args

  const previousRevisions = await cmrQuery({
    conceptType: 'tools',
    options: {
      format: 'umm_json'
    },
    params: {
      conceptId,
      allRevisions: true
    }
  })

  const { data: responseData } = previousRevisions

  // Find the requested revision for the provided concept
  const previousRevision = findPreviousRevision(responseData, revisionId)

  const { meta, umm } = previousRevision

  const { 'native-id': nativeId } = meta

  // Query CMR
  tool.ingest({
    nativeId,
    providerId: getProviderFromConceptId(conceptId),
    ...umm
  }, ingestKeys, headers)

  // Parse the response from CMR
  await tool.parseIngest(requestInfo)

  // Return a formatted JSON response
  return tool.getFormattedIngestResponse()
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
