import { cmrQuery } from '../utils/cmrQuery'
import { findPreviousRevision } from '../utils/findPreviousRevision'
import { getProviderFromConceptId } from '../utils/getProviderFromConceptId'
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

  // Return a formatted JSON response
  return service.getFormattedResponse()
}

export const restoreServiceRevision = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, serviceKeyMap, 'service')

  const {
    ingestKeys
  } = requestInfo

  const service = new Service(headers, requestInfo, args)

  const {
    conceptId,
    revisionId
  } = args

  const previousRevisions = await cmrQuery({
    conceptType: 'services',
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
  service.ingest({
    nativeId,
    providerId: getProviderFromConceptId(conceptId),
    ...umm
  }, ingestKeys, headers)

  // Parse the response from CMR
  await service.parseIngest(requestInfo)

  // Return a formatted JSON response
  return service.getFormattedIngestResponse()
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
