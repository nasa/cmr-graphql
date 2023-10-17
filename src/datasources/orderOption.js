import { parseRequestedFields } from '../utils/parseRequestedFields'

import orderOptionKeyMap from '../utils/umm/orderOptionKeyMap.json'

import OrderOption from '../cmr/concepts/orderOption'

export default async (params, context, parsedInfo) => {
  // This passes orderOption and will transform to the OrderOption graphql type
  const requestInfo = parseRequestedFields(parsedInfo, orderOptionKeyMap, 'orderOption')

  const { headers } = context

  const orderOption = new OrderOption(headers, requestInfo, params)

  // Query CMR
  orderOption.fetch(params)

  // Parse the response from CMR
  await orderOption.parse(requestInfo)

  // Return a formatted JSON response
  return orderOption.getFormattedResponse()
}
