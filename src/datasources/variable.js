import snakeCaseKeys from 'snakecase-keys'

import { get } from 'lodash'

import { parseCmrVariables } from '../utils/parseCmrVariables'
import { queryCmrVariables } from '../utils/queryCmrVariables'
import { parseCmrError } from '../utils/parseCmrError'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import variableKeyMap from '../utils/umm/variableKeyMap.json'

export default async (params, headers, parsedInfo) => {
  try {
    const result = {}

    let totalCount = 0

    const requestInfo = parseRequestedFields(parsedInfo, variableKeyMap, 'variable')
    const {
      ummKeys,
      isList
    } = requestInfo

    const cmrResponse = await queryCmrVariables(params, headers, requestInfo)

    const [jsonResponse, ummResponse] = cmrResponse

    if (jsonResponse) {
      const { headers } = jsonResponse
      const { 'cmr-hits': cmrHits } = headers
      totalCount = cmrHits

      const variables = parseCmrVariables(jsonResponse)

      variables.forEach((variable) => {
        // Alias concept_id for consistency in responses
        const { concept_id: id } = variable

        // There are no keys in the json endpoint that are not available
        // in the umm endpoint so services should never make two requests
        // meaning that result will never be already set for a particular id
        result[id] = variable
      })
    }

    if (ummResponse) {
      // Pull out the key mappings so we can retrieve the values below
      const { ummKeyMappings } = variableKeyMap

      const { headers } = ummResponse
      const { 'cmr-hits': cmrHits } = headers
      totalCount = cmrHits

      const variables = parseCmrVariables(ummResponse)

      variables.forEach((variable) => {
        const { meta } = variable
        const { 'concept-id': id } = meta

        // There are no keys in the json endpoint that are not available
        // in the umm endpoint so services should never make two requests
        // meaning that result will never be already set for a particular id
        result[id] = {}

        // Loop through the requested umm keys
        ummKeys.forEach((ummKey) => {
          // Use lodash.get to retrieve a value from the umm response given they
          // path we've defined above
          const keyValue = get(variable, ummKeyMappings[ummKey])

          if (keyValue) {
            // Snake case the key requested and any children of that key
            Object.assign(result[id], snakeCaseKeys({ [ummKey]: keyValue }))
          }
        })
      })
    }

    if (isList) {
      return {
        count: totalCount,
        items: Object.values(result)
      }
    }
    return Object.values(result)
  } catch (error) {
    parseCmrError(error)
  }

  return []
}
