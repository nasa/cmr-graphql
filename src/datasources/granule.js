import snakeCaseKeys from 'snakecase-keys'

import { get } from 'lodash'

import { parseCmrGranules } from '../utils/parseCmrGranules'
import { queryCmrGranules } from '../utils/queryCmrGranules'
import { parseCmrError } from '../utils/parseCmrError'
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
        const { id: conceptId } = granule

        // Rename (delete the id key and set the concept_id key) `id` for consistency
        // eslint-disable-next-line no-param-reassign
        delete granule.id

        // eslint-disable-next-line no-param-reassign
        granule.concept_id = conceptId

        const { [conceptId]: existingResult = {} } = result

        result[conceptId] = {
          ...existingResult,

          // TODO: Pull out and return only supported keys?
          ...granule
        }
      })
    }

    if (ummResponse) {
      // Pull out the key mappings so we can retrieve the values below
      const { ummKeyMappings } = granuleKeyMap

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
          const keyValue = get(granule, ummKeyMappings[ummKey])

          if (keyValue) {
            // Snake case the key requested and any children of that key
            Object.assign(result[id], snakeCaseKeys({ [ummKey]: keyValue }))
          }
        })
      })
    }

    return Object.values(result)
  } catch (error) {
    parseCmrError(error)
  }

  return []
}
