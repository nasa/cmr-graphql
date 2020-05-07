import { get } from 'lodash'

import { parseCmrCollections } from '../utils/parseCmrCollections'
import { queryCmrCollections } from '../utils/queryCmrCollections'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

export default async (params, headers, parsedInfo) => {
  try {
    const result = {}

    const { fieldsByTypeName } = parsedInfo
    const { Collection: collectionKeysRequested } = fieldsByTypeName
    const requestedFields = Object.keys(collectionKeysRequested)

    const requestInfo = parseRequestedFields(requestedFields, collectionKeyMap)
    const {
      ummKeys
    } = requestInfo

    const cmrResponse = await queryCmrCollections(params, headers, requestInfo)

    const [jsonResponse, ummResponse] = cmrResponse

    if (jsonResponse) {
      const collections = parseCmrCollections(jsonResponse)

      collections.forEach((collection) => {
        // Alias concept_id for consistency in responses
        const { id } = collection

        const { [id]: existingResult = {} } = result
        result[id] = {
          ...existingResult,

          // TODO: Pull out and return only supported keys?
          ...collection
        }
      })
    }

    if (ummResponse) {
      const collections = parseCmrCollections(ummResponse, 'umm_json')

      collections.forEach((collection) => {
        const { meta } = collection
        const { 'concept-id': id } = meta

        // If no record of this concept is found create an empty object at its key
        if (!Object.keys(result).includes(id)) result[id] = {}

        // Loop through the requested umm keys
        ummKeys.forEach((ummKey) => {
          // Use lodash.get to retrieve a value from the umm response given they
          // path we've defined above
          result[id][ummKey] = get(collection, collectionKeyMap[ummKey])
        })
      })
    }

    return Object.values(result)
  } catch (e) {
    console.log(e.toString())

    return []
  }
}
