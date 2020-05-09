import snakeCaseKeys from 'snakecase-keys'

import { get } from 'lodash'

import { parseCmrServices } from '../utils/parseCmrServices'
import { queryCmrServices } from '../utils/queryCmrServices'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import serviceKeyMap from '../utils/umm/serviceKeyMap.json'

export default async (params, headers, parsedInfo) => {
  try {
    const result = {}

    const { fieldsByTypeName } = parsedInfo
    const { Service: serviceKeysRequested } = fieldsByTypeName
    const requestedFields = Object.keys(serviceKeysRequested)

    const requestInfo = parseRequestedFields(requestedFields, serviceKeyMap)
    const {
      ummKeys
    } = requestInfo

    const cmrResponse = await queryCmrServices(params, headers, requestInfo)

    const [jsonResponse, ummResponse] = cmrResponse

    if (jsonResponse) {
      const services = parseCmrServices(jsonResponse)

      services.forEach((service) => {
        // Alias concept_id for consistency in responses
        const { concept_id: id } = service

        const { [id]: existingResult = {} } = result
        result[id] = {
          ...existingResult,

          // TODO: Pull out and return only supported keys?
          ...service
        }
      })
    }

    if (ummResponse) {
      const services = parseCmrServices(ummResponse)

      services.forEach((service) => {
        const { meta } = service
        const { 'concept-id': id } = meta

        // If no record of this concept is found create an empty object at its key
        if (!Object.keys(result).includes(id)) result[id] = {}

        // Loop through the requested umm keys
        ummKeys.forEach((ummKey) => {
          // Use lodash.get to retrieve a value from the umm response given they
          // path we've defined above
          result[id][ummKey] = get(service, serviceKeyMap[ummKey])
        })
      })
    }

    return snakeCaseKeys(Object.values(result))
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
