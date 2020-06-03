import snakeCaseKeys from 'snakecase-keys'

import { get } from 'lodash'

import { parseCmrCollections } from '../utils/parseCmrCollections'
import { queryCmrCollections } from '../utils/queryCmrCollections'
import { parseCmrError } from '../utils/parseCmrError'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

export default async (params, headers, parsedInfo) => {
  try {
    const result = {}

    let totalCount = 0

    const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')
    const {
      ummKeys,
      isList
    } = requestInfo

    const cmrResponse = await queryCmrCollections(params, headers, requestInfo)

    const [jsonResponse, ummResponse] = cmrResponse

    if (jsonResponse) {
      const { headers } = jsonResponse
      const { 'cmr-hits': cmrHits } = headers
      totalCount = cmrHits

      const collections = parseCmrCollections(jsonResponse)

      collections.forEach((collection) => {
        // Alias concept_id for consistency in responses
        const { id: conceptId } = collection

        // Rename (delete the id key and set the concept_id key) `id` for consistency
        // eslint-disable-next-line no-param-reassign
        delete collection.id

        // eslint-disable-next-line no-param-reassign
        collection.concept_id = conceptId

        const { [conceptId]: existingResult = {} } = result

        result[conceptId] = {
          ...existingResult,

          // TODO: Pull out and return only supported keys?
          ...collection
        }
      })
    }

    if (ummResponse) {
      // Pull out the key mappings so we can retrieve the values below
      const { ummKeyMappings } = collectionKeyMap

      const { headers } = ummResponse
      const { 'cmr-hits': cmrHits } = headers
      totalCount = cmrHits

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
          const keyValue = get(collection, ummKeyMappings[ummKey])

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
    return parseCmrError(error)
  }
}
