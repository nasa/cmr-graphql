import { parseRequestedFields } from '../utils/parseRequestedFields'

import subscriptionKeyMap from '../utils/umm/subscriptionKeyMap.json'

import Subscription from '../cmr/concepts/subscription'

export const fetchSubscription = async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, subscriptionKeyMap, 'subscription')

  const subscription = new Subscription(headers, requestInfo, params)

  // Query CMR
  subscription.fetch(params)

  // Parse the response from CMR
  await subscription.parse(requestInfo)

  // Return a formatted JSON response
  return subscription.getFormattedResponse()
}

export const ingestSubscription = async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, subscriptionKeyMap, 'subscription')

  const {
    ingestKeys
  } = requestInfo

  const subscription = new Subscription(headers, requestInfo, params)

  // Contact CMR
  subscription.ingest(params, ingestKeys, headers)

  // Parse the response from CMR
  await subscription.parseIngest(requestInfo)

  // Return a formatted JSON response
  return subscription.getFormattedIngestResponse()
}

export const deleteSubscription = async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, subscriptionKeyMap, 'subscription')

  const {
    ingestKeys
  } = requestInfo

  const subscription = new Subscription(headers, requestInfo, params)

  // Contact CMR
  subscription.delete(params, ingestKeys, headers)

  // Parse the response from CMR
  await subscription.parseDelete(requestInfo)

  // Return a formatted JSON response
  return subscription.getFormattedDeleteResponse()
}
