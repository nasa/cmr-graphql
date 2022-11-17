import { parseRequestedFields } from '../utils/parseRequestedFields'

import gridKeyMap from '../utils/umm/gridKeyMap.json'

import Grid from '../cmr/concepts/grid'

export default async (params, context, parsedInfo) => {
  const requestInfo = parseRequestedFields(parsedInfo, gridKeyMap, 'grid')
  const { headers } = context

  const grid = new Grid(headers, requestInfo, params)

  // Query CMR
  grid.fetch(params)

  // Parse the response from CMR
  await grid.parse(requestInfo)

  // Return a formatted JSON response
  return grid.getFormattedResponse()
}
