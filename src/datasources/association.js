import Association from '../cmr/concepts/association'
import { parseRequestedFields } from '../utils/parseRequestedFields'
import associationKeyMap from '../utils/umm/associationKeyMap.json'

export const createAssociation = async (args, context, parsedInfo) => {
  const { headers } = context
  const { conceptType } = args

  const requestInfo = parseRequestedFields(parsedInfo, associationKeyMap, 'Association')

  const {
    ingestKeys
  } = requestInfo

  const association = new Association(`${conceptType.toLowerCase()}s`, headers, requestInfo, args)

  // Contact CMR
  association.create(args, ingestKeys, headers)

  // Parse the response from CMR
  await association.parseCreate(requestInfo)

  // Return a formatted JSON response
  return association.getFormattedIngestResponse()
}

export const createVariableAssociation = async (args, context, parsedInfo) => {
  const { headers } = context
  const { conceptType } = args

  const requestInfo = parseRequestedFields(parsedInfo, associationKeyMap, 'Association')

  const {
    ingestKeys
  } = requestInfo

  const association = new Association(`${conceptType.toLowerCase()}s`, headers, requestInfo, args)

  // Contact CMR
  association.createVariable(args, ingestKeys, headers)

  // Parse the response from CMR
  await association.parseIngest(requestInfo)

  // Return a formatted JSON response
  return association.getFormattedIngestResponse()
}
