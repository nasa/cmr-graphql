import { parseRequestedFields } from '../utils/parseRequestedFields'

import serviceKeyMap from '../utils/umm/serviceKeyMap.json'

import Service from '../cmr/concepts/service'

export const fetchServices = async (params, context, parsedInfo, parentCollectionConceptId) => {
  // For service queries that are children of collections queries, parentCollectionConceptId is defined.
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, serviceKeyMap, 'service')

  const service = new Service(headers, requestInfo, params, parentCollectionConceptId)

  // Query CMR
  service.fetch(params)

  // Parse the response from CMR
  await service.parse(requestInfo)

  console.log(service.getFormattedResponse())

  // Return a formatted JSON response
  return service.getFormattedResponse()
}

export const deleteService = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, serviceKeyMap, 'service')

  const {
    ingestKeys
  } = requestInfo

  const service = new Service(headers, requestInfo, args)

  // Contact CMR
  service.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await service.parseDelete(requestInfo)

  // Return a formatted JSON response
  return service.getFormattedDeleteResponse()
}
