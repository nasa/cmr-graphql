import { parseRequestedFields } from '../utils/parseRequestedFields'

import granuleKeyMap from '../utils/umm/granuleKeyMap.json'

import Granule from '../cmr/concepts/granule'

export default async (params, headers, parsedInfo) => {
  const requestInfo = parseRequestedFields(parsedInfo, granuleKeyMap, 'granule')

  const granule = new Granule(headers, requestInfo)

  // Query CMR
  granule.fetch(params)

  // Parse the response from CMR
  await granule.parse(requestInfo)

  // Return a formatted JSON response
  return granule.getFormattedResponse()
}
