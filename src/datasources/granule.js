import { get } from 'lodash'

import { parseCmrGranules } from '../utils/parseCmrGranules'
import { queryCmrGranules } from '../utils/queryCmrGranules'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import granuleKeyMap from '../utils/umm/granuleKeyMap.json'

export default async (params, headers, parsedInfo) => {
  try {
    const result = {}

    const { fieldsByTypeName } = parsedInfo
    const { Granule: granuleKeysRequested } = fieldsByTypeName
    const requestedFields = Object.keys(granuleKeysRequested)

    const requestInfo = parseRequestedFields(requestedFields, granuleKeyMap)
    const {
      ummKeys
    } = requestInfo

    const cmrResponse = await queryCmrGranules(params, headers, requestInfo)

    const [jsonResponse, ummResponse] = cmrResponse

    if (jsonResponse) {
      const granules = parseCmrGranules(jsonResponse)

      granules.forEach((granule) => {
        // Alias concept_id for consistency in responses
        const { id } = granule

        const { [id]: existingResult = {} } = result
        result[id] = {
          ...existingResult,

          // TODO: Pull out and return only supported keys?
          ...granule
        }
      })
    }

    if (ummResponse) {
      const granules = parseCmrGranules(ummResponse, 'umm_json')

      granules.forEach((granule) => {
        const { meta } = granule
        const { 'concept-id': id } = meta

        // If no record of this concept is found create an empty object at its key
        if (!Object.keys(result).includes(id)) result[id] = {}

        // Loop through the requested umm keys
        ummKeys.forEach((ummKey) => {
          // Use lodash.get to retrieve a value from the umm response given they
          // path we've defined above
          result[id][ummKey] = get(granule, granuleKeyMap[ummKey])
        })
      })
    }

    return Object.values(result)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
