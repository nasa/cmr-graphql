import { parseRequestedFields } from '../utils/parseRequestedFields'

import subscriptionKeyMap from '../utils/umm/subscriptionKeyMap.json'

import Subscription from '../cmr/concepts/subscription'

export default async (params, headers, parsedInfo) => {
  const requestInfo = parseRequestedFields(parsedInfo, subscriptionKeyMap, 'subscription')

  const subscription = new Subscription(headers, requestInfo)

  // Query CMR
  subscription.fetch(params)

  // Parse the response from CMR
  await subscription.parse(requestInfo)

  // Return a formatted JSON response
  return subscription.getFormattedResponse()
}
