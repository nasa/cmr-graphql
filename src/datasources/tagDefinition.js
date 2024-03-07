import TagDefinition from '../cmr/concepts/tagDefinition'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import tagKeyMap from '../utils/umm/tagKeyMap.json'

export default async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, tagKeyMap, 'tagDefinition')

  const tagDefinition = new TagDefinition(headers, requestInfo, params)

  // Query CMR
  tagDefinition.fetch(params)

  // Parse the response from CMR
  await tagDefinition.parse(requestInfo)

  // Return a formatted JSON response
  return tagDefinition.getFormattedResponse()
}
