import { difference, isEmpty, upperFirst } from 'lodash'

import { CONCEPT_TYPES } from '../constants'

/**
 * Construct an object defining UMM key information
 * @param {Array} requestedFields Fields requested
 * @param {Object} keyMap Mappings of UMM fields to requestable fields
 * @param {String} conceptName Name of the concept () to lookup requested fields in the query
 */
export const parseRequestedFields = (parsedInfo, keyMap, conceptName) => {
  let { fieldsByTypeName } = parsedInfo

  const { name } = parsedInfo

  let isList = false

  const metaKeys = []

  let requestedFields = []

  // Name will match the query, if the query is plural we have a slightly different
  // response and we need to handle it
  if (name.slice(-1) === 's') {
    isList = true

    const {
      [`${upperFirst(conceptName.toLowerCase())}List`]: conceptListKeysRequested
    } = fieldsByTypeName
    const {
      count,
      cursor,
      items = {}
    } = conceptListKeysRequested

    fieldsByTypeName = items.fieldsByTypeName

    // If the user requested `count` or `cursor` and no other fields, default the requested fields
    // to convince graph that it should still make a request
    if ((count || cursor) && isEmpty(items)) {
      requestedFields = ['conceptId']
    }

    // Track meta keys for analytics on how often they are requested
    if (cursor) metaKeys.push(`${conceptName.toLowerCase()}Cursor`)

    // If count was requested, append the specific concept for logging specificity
    if (count) metaKeys.push(`${conceptName.toLowerCase()}Count`)
  }

  // If a plural query is being performed, and the user has not requested any
  // fields (e.g. only count) then fieldsByTypeName will be undefined and we can ignore it
  if (fieldsByTypeName) {
    const {
      [upperFirst(conceptName.toLowerCase())]: conceptKeysRequested
    } = fieldsByTypeName

    requestedFields = Object.keys(conceptKeysRequested)
  }

  // Determine which of the requested fields are concept types
  const conceptFields = requestedFields.filter((field) => CONCEPT_TYPES.indexOf(field) > -1)

  // Determine which of the requested fields are not concept types
  const nonConceptFields = requestedFields.filter((field) => CONCEPT_TYPES.indexOf(field) === -1)

  // If the requested fields only include concepts append conceptId to ensure a request is made
  if (conceptFields.length > 0 && nonConceptFields.length === 0) {
    requestedFields = [
      'conceptId',
      ...conceptFields
    ]
  }

  if (name === 'collections') {
    // If a user has requested granules, from within a collection request the resolver
    // will pull the conceptId and provide it to the granules request but if a user
    // doesn't explicity ask for the collection concept id we need to request it
    if (requestedFields.includes('granules') && !requestedFields.includes('conceptId')) {
      requestedFields.push('conceptId')
    }
  }

  if (name === 'subscriptions') {
    // If a user has requested collection, from within a subscriptions request the resolver
    // will pull the collectionConceptId and provide it to the subscriptions request but if a user
    // doesn't explicity ask for the collection concept id we need to request it
    if (requestedFields.includes('collection') && !requestedFields.includes('collectionConceptId')) {
      requestedFields.push('collectionConceptId')
    }
  }

  const { sharedKeys, ummKeyMappings } = keyMap

  // Gather keys that the user requested that only exist in umm
  let ummKeys = requestedFields.filter((x) => (
    Object.keys(ummKeyMappings).includes(x)
  ))

  // If all requested keys are available in json, use json because its all indexed in CMR
  if (difference(ummKeys, sharedKeys).length === 0) {
    return {
      jsonKeys: requestedFields,
      metaKeys,
      ummKeys: [],
      ummKeyMappings,
      isList
    }
  }

  // Requested keys that are not UMM must be json
  const jsonKeys = requestedFields.filter((x) => !ummKeys.includes(x))

  // If we already have to go to the json endpoint get as much info from there as possible
  if (jsonKeys.length > 0) {
    // Move any requested key that is shared over to the jsonKeys
    ummKeys.forEach((ummKey) => {
      const keyLocation = sharedKeys.indexOf(ummKey)

      if (keyLocation > -1) jsonKeys.push(ummKey)
    })

    // Remove any keys that we moved over to jsonKeys
    ummKeys = ummKeys.filter((x) => !jsonKeys.includes(x))
  }

  // Sort the keys to prevent fragility in testing
  return {
    jsonKeys: jsonKeys.sort(),
    metaKeys,
    ummKeys: ummKeys.sort(),
    ummKeyMappings,
    isList
  }
}