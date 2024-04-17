import { parseRequestedFields } from '../utils/parseRequestedFields'

import orderOptionKeyMap from '../utils/umm/orderOptionKeyMap.json'

import OrderOption from '../cmr/concepts/orderOption'

export const fetchOrderOption = async (params, context, parsedInfo) => {
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

export const ingestOrderOption = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, orderOptionKeyMap, 'orderOption')

  const {
    ingestKeys
  } = requestInfo

  const orderOption = new OrderOption(headers, requestInfo, args)

  // Query CMR
  orderOption.ingest(args, ingestKeys, headers)

  // Parse the response from CMR
  await orderOption.parseIngest(requestInfo)

  // Return a formatted JSON response
  return orderOption.getFormattedIngestResponse()
}

export const deleteOrderOption = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, orderOptionKeyMap, 'orderOption')

  const {
    ingestKeys
  } = requestInfo

  const orderOption = new OrderOption(headers, requestInfo, args)

  // Query CMR
  orderOption.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await orderOption.parseDelete(requestInfo)

  // Return a formatted JSON response
  return orderOption.getFormattedDeleteResponse()
}
