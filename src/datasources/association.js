import { parseRequestedFields } from '../utils/parseRequestedFields'

import Association from '../cmr/concepts/association'

import associationKeyMap from '../utils/umm/associationKeyMap.json'

export const createAssociation = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, associationKeyMap, 'Association')

  const {
    ingestKeys
  } = requestInfo

  const association = new Association(headers, requestInfo, args)

  // Contact CMR
  association.ingest(args, ingestKeys, headers)

  // Parse the response from CMR
  await association.parseIngest(requestInfo)

  // Return a formatted JSON response
  return association.getFormattedIngestResponse()
}

export const deleteAssociation = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, associationKeyMap, 'Association')

  const {
    ingestKeys
  } = requestInfo

  const association = new Association(headers, requestInfo, args)

  // Contact CMR
  association.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await association.parseIngest(requestInfo)

  // Return a formatted JSON response
  return association.getFormattedIngestResponse()
}
