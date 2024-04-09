import { parseRequestedFields } from '../utils/parseRequestedFields'

import Acl from '../cmr/concepts/acl'

export const fetchAcl = async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, {}, 'acl')

  const acl = new Acl(headers, requestInfo, params)

  // Query CMR
  acl.fetch(params)

  // Parse the response from CMR
  await acl.parse(requestInfo)

  // Return a formatted JSON response
  return acl.getFormattedResponse()
}

export const createAcl = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, {}, 'acl')

  const {
    ingestKeys
  } = requestInfo

  const acl = new Acl(headers, requestInfo, args)

  // Query CMR
  acl.create(args, ingestKeys, headers)

  // Parse the response from CMR
  await acl.parseIngest(requestInfo)

  // Return a formatted JSON response
  return acl.getFormattedIngestResponse()
}

export const updateAcl = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, {}, 'acl')

  const {
    ingestKeys
  } = requestInfo

  const acl = new Acl(headers, requestInfo, args)

  // Query CMR
  acl.update(args, ingestKeys, headers)

  // Parse the response from CMR
  await acl.parseIngest(requestInfo)

  // Return a formatted JSON response
  return acl.getFormattedIngestResponse()
}

export const deleteAcl = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, {}, 'acl')

  const {
    ingestKeys
  } = requestInfo

  const acl = new Acl(headers, requestInfo, args)

  // Query CMR
  acl.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await acl.parseDelete(requestInfo)

  // Return a formatted JSON response
  return acl.getFormattedDeleteResponse()
}
