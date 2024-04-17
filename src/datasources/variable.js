import { cmrQuery } from '../utils/cmrQuery'
import { findPreviousRevision } from '../utils/findPreviousRevision'
import { getProviderFromConceptId } from '../utils/getProviderFromConceptId'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import variableKeyMap from '../utils/umm/variableKeyMap.json'

import Variable from '../cmr/concepts/variable'

export const fetchVariables = async (params, context, parsedInfo) => {
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

export const restoreVariableRevision = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, variableKeyMap, 'variable')

  const {
    ingestKeys
  } = requestInfo

  const variable = new Variable(headers, requestInfo, args)

  const {
    conceptId,
    revisionId
  } = args

  const previousRevisions = await cmrQuery({
    conceptType: 'variables',
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
  variable.ingest({
    nativeId,
    providerId: getProviderFromConceptId(conceptId),
    ...umm
  }, ingestKeys, headers)

  // Parse the response from CMR
  await variable.parseIngest(requestInfo)

  // Return a formatted JSON response
  return variable.getFormattedIngestResponse()
}

export const deleteVariable = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, variableKeyMap, 'variable')

  const {
    ingestKeys
  } = requestInfo

  const variable = new Variable(headers, requestInfo, args)

  // Contact CMR
  variable.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await variable.parseDelete(requestInfo)

  // Return a formatted JSON response
  return variable.getFormattedDeleteResponse()
}
