import { parseRequestedFields } from '../utils/parseRequestedFields'

import serviceKeyMap from '../utils/umm/serviceKeyMap.json'

import Service from '../cmr/concepts/service'

export default async (params, context, parsedInfo, parentCollectionConceptId) => {
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
