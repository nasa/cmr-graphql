import camelCaseKeys from 'camelcase-keys'

import { get, snakeCase } from 'lodash'

import { parseCmrCollections } from '../utils/parseCmrCollections'
import { parseCmrError } from '../utils/parseCmrError'
import { parseRequestedFields } from '../utils/parseRequestedFields'
import { queryCmrCollections } from '../utils/queryCmrCollections'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

export default async (params, headers, parsedInfo) => {
  try {
    const result = {}

    const scrollIds = {}
    let totalCount = 0

    const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')
    const {
      jsonKeys,
      ummKeys,
      isList
    } = requestInfo

    const cmrResponse = await queryCmrCollections(params, headers, requestInfo)

    const [jsonResponse, ummResponse] = cmrResponse

    if (jsonResponse) {
      const { headers } = jsonResponse
      const {
        'cmr-hits': cmrHits,
        'cmr-scroll-id': jsonScrollId
      } = headers

      totalCount = cmrHits
      if (jsonScrollId) scrollIds.json = jsonScrollId

      const collections = parseCmrCollections(jsonResponse)

      collections.forEach((collection) => {
        // Alias conceptId for consistency in responses
        const {
          id: conceptId,
          summary
        } = collection

        // Rename (delete the id key and set the conceptId key) `id` for consistency
        // eslint-disable-next-line no-param-reassign
        delete collection.id

        // eslint-disable-next-line no-param-reassign
        collection.concept_id = conceptId

        // Alias summary offering the same value using a different key to allow clients to transition
        // eslint-disable-next-line no-param-reassign
        collection.abstract = summary

        // If no record of this concept is found create an empty object at its key
        const { [conceptId]: existingResult = { conceptId } } = result

        result[conceptId] = {
          ...existingResult
        }

        // Associations are used by services and variables, its required to correctly
        // retrieve those objects and shouldn't need to be provided by the client
        const { associations } = collection
        if (associations) {
          result[conceptId].associations = associations
        }

        jsonKeys.forEach((jsonKey) => {
          const cmrKey = snakeCase(jsonKey)

          const { [cmrKey]: keyValue } = collection

          // Snake case the key requested and any children of that key
          result[conceptId][jsonKey] = keyValue
        })
      })
    }

    if (ummResponse) {
      // Pull out the key mappings so we can retrieve the values below
      const { ummKeyMappings } = collectionKeyMap

      const { headers } = ummResponse
      const {
        'cmr-hits': cmrHits,
        'cmr-scroll-id': ummScrollId
      } = headers

      totalCount = cmrHits
      if (ummScrollId) scrollIds.umm = ummScrollId

      const collections = parseCmrCollections(ummResponse, 'umm_json')

      collections.forEach((collection) => {
        const { meta } = collection
        const { associations, 'concept-id': id } = meta

        // If no record of this concept is found create an empty object at its key
        if (!Object.keys(result).includes(id)) result[id] = { conceptId: id }

        // Associations are used by services and variables, its required to correctly
        // retrieve those objects and shouldn't need to be provided by the client
        if (associations) {
          result[id].associations = associations
        }

        // Loop through the requested umm keys
        ummKeys.forEach((ummKey) => {
          // Use lodash.get to retrieve a value from the umm response given they
          // path we've defined above
          const keyValue = get(collection, ummKeyMappings[ummKey])

          if (keyValue) {
            // Snake case the key requested and any children of that key
            Object.assign(result[id], camelCaseKeys({ [ummKey]: keyValue }, { deep: true }))
          }
        })
      })
    }

    if (isList) {
      return {
        count: totalCount,
        cursor: Buffer.from(
          JSON.stringify(scrollIds)
        ).toString('base64'),
        items: Object.values(result)
      }
    }
    return Object.values(result)
  } catch (error) {
    return parseCmrError(error)
  }
}
