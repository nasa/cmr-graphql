import { pick } from 'lodash'

import { getConceptTypes } from './getConceptTypes'
import { queryCmr } from './queryCmr'

export const queryCmrUmmConcept = (
  conceptType,
  permittedSearchParams,
  headers,
  requestInfo
) => {
  // Default an array to hold the promises we need to make depending on the requested fields
  const promises = []
  const {
    jsonKeys,
    metaKeys = [],
    ummKeys
  } = requestInfo
  const { 'CMR-Request-Id': requestId } = headers

  metaKeys.forEach((param) => {
    console.log(`Request ${requestId} to [concept: ${conceptType}] requested [format: meta, key: ${param}]`)
  })

  if (jsonKeys.length > 0) {
    // Construct the promise that will request data from the json endpoint
    promises.push(
      queryCmr(conceptType, permittedSearchParams, headers)
    )

    // Define all the objects a user can query against
    const ummTypes = getConceptTypes()

    // Prevent logging concept types, their meta keys are logged above
    const filteredJsonKeys = jsonKeys.filter((field) => ummTypes.indexOf(field) === -1)

    filteredJsonKeys.forEach((param) => {
      console.log(`Request ${requestId} to [concept: ${conceptType}] requested [format: json, key: ${param}]`)
    })
  } else {
    // Push a null promise to the array so that the umm promise always exists as
    // the second element of the promise array
    promises.push(
      new Promise((resolve) => resolve(null))
    )
  }

  // If any requested keys are umm keys, we need to make an additional request to cmr
  if (ummKeys.length > 0) {
    /**
     * The following keys are 'supported' by CMR in that they don't throw an error, but
     * nothing returns when they are used
     *
     * - include_has_granules
     * - include_tags
     */
    const ummPermittedKeys = pick(permittedSearchParams, [
      'bounding_box',
      'circle',
      'collection_concept_id',
      'concept_id',
      'has_granules_or_cwic',
      'has_granules',
      'name',
      'offset',
      'page_size',
      'point',
      'polygon',
      'provider',
      'short_name',
      'sort_key',
      'temporal'
    ])

    // Construct the promise that will request data from the umm endpoint
    promises.push(
      queryCmr(conceptType, ummPermittedKeys, headers, {
        format: 'umm_json'
      })
    )

    ummKeys.forEach((param) => {
      console.log(`Request ${requestId} to [concept: ${conceptType}] requested [format: umm, key: ${param}]`)
    })
  } else {
    promises.push(
      new Promise((resolve) => resolve(null))
    )
  }

  return Promise.all(promises)
}
