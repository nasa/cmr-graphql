import { parseRequestedFields } from '../utils/parseRequestedFields'

import variableKeyMap from '../utils/umm/variableKeyMap.json'

import Variable from '../cmr/concepts/variable'

export const fetchVariables = async (params, context, parsedInfo, parentCollectionConceptId) => {
  // For variable queries that are children of collections queries, parentCollectionConceptId is defined.
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, variableKeyMap, 'variable')

  const variable = new Variable(headers, requestInfo, params, parentCollectionConceptId)

  // Query CMR
  variable.fetch(params)

  // Parse the response from CMR
  await variable.parse(requestInfo)

  // Return a formatted JSON response
  return variable.getFormattedResponse()
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
