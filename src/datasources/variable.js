import snakeCaseKeys from 'snakecase-keys'

import { get } from 'lodash'

import { parseCmrVariables } from '../utils/parseCmrVariables'
import { queryCmrVariables } from '../utils/queryCmrVariables'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import variableKeyMap from '../utils/umm/variableKeyMap.json'

export default async (params, headers, parsedInfo) => {
  try {
    const result = {}

    const { fieldsByTypeName } = parsedInfo
    const { Variable: variableKeysRequested } = fieldsByTypeName
    const requestedFields = Object.keys(variableKeysRequested)

    const requestInfo = parseRequestedFields(requestedFields, variableKeyMap)
    const {
      ummKeys
    } = requestInfo

    const cmrResponse = await queryCmrVariables(params, headers, requestInfo)

    const [jsonResponse, ummResponse] = cmrResponse

    if (jsonResponse) {
      const variables = parseCmrVariables(jsonResponse)

      variables.forEach((variable) => {
        // Alias concept_id for consistency in responses
        const { concept_id: id } = variable

        const { [id]: existingResult = {} } = result
        result[id] = {
          ...existingResult,

          // TODO: Pull out and return only supported keys?
          ...variable
        }
      })
    }

    if (ummResponse) {
      const variables = parseCmrVariables(ummResponse)

      variables.forEach((variable) => {
        const { meta } = variable
        const { 'concept-id': id } = meta

        // If no record of this concept is found create an empty object at its key
        if (!Object.keys(result).includes(id)) result[id] = {}

        // Loop through the requested umm keys
        ummKeys.forEach((ummKey) => {
          // Use lodash.get to retrieve a value from the umm response given they
          // path we've defined above
          result[id][ummKey] = get(variable, variableKeyMap[ummKey])
        })
      })
    }

    return snakeCaseKeys(Object.values(result))
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
