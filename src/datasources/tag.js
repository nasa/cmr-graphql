import Tag from '../cmr/concepts/tag'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import tagKeyMap from '../utils/umm/tagKeyMap.json'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, tagKeyMap, 'tag')

  const tag = new Tag(headers, requestInfo, params)

  // Query CMR
  tag.fetch(params)

  // Parse the response from CMR
  await tag.parse(requestInfo)

  // Return a formatted JSON response
  return tag.getFormattedResponse()
}
