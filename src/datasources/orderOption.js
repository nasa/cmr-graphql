import { parseRequestedFields } from '../utils/parseRequestedFields'

import orderOptionKeyMap from '../utils/umm/orderOptionKeyMap.json'

import OrderOption from '../cmr/concepts/orderOption'

export default async (params, context, parsedInfo) => {
// TOOD: Which is this using?
  console.log('parsed info for the oderOption', parsedInfo)
  // This passes orderOption and will transform to OrderOption
  const requestInfo = parseRequestedFields(parsedInfo, orderOptionKeyMap, 'orderOption')
  const { headers } = context
  console.log('the request info for the orderOption', requestInfo)

  const orderOption = new OrderOption(headers, requestInfo, params)

  //   console.log('instance of the order-option obj', orderOption)
  // Query CMR
  orderOption.fetch(params)

  // Parse the response from CMR
  await orderOption.parse(requestInfo)

  const ooResponse = orderOption.getFormattedResponse()
  console.log('this is the oo response from cmr', ooResponse)
  // Return a formatted JSON response
  return orderOption.getFormattedResponse()
}
