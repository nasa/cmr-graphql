import { cmrQuery } from '../utils/cmrQuery'
import { findPreviousRevision } from '../utils/findPreviousRevision'
import { getProviderFromConceptId } from '../utils/getProviderFromConceptId'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import visualizationKeyMap from '../utils/umm/visualizationKeyMap.json'

import Visualization from '../cmr/concepts/visualization'

export const fetchVisualizations = async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, visualizationKeyMap, 'visualization')

  const visualization = new Visualization(headers, requestInfo, params)

  // Query CMR
  visualization.fetch(params)

  // Parse the response from CMR
  await visualization.parse(requestInfo)

  // Return a formatted JSON response
  return visualization.getFormattedResponse()
}

export const restoreVisualizationRevision = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, visualizationKeyMap, 'visualization')

  const {
    ingestKeys
  } = requestInfo

  const visualization = new Visualization(headers, requestInfo, args)

  const {
    conceptId,
    revisionId
  } = args

  const previousRevisions = await cmrQuery({
    conceptType: 'visualizations',
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
  visualization.ingest({
    nativeId,
    providerId: getProviderFromConceptId(conceptId),
    ...umm
  }, ingestKeys, headers)

  // Parse the response from CMR
  await visualization.parseIngest(requestInfo)

  // Return a formatted JSON response
  return visualization.getFormattedIngestResponse()
}

export const deleteVisualization = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, visualizationKeyMap, 'visualization')

  const {
    ingestKeys
  } = requestInfo

  const visualization = new Visualization(headers, requestInfo, args)

  // Contact CMR
  visualization.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await visualization.parseDelete(requestInfo)

  // Return a formatted JSON response
  return visualization.getFormattedDeleteResponse()
}
