import difference from 'lodash/difference'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import upperFirst from 'lodash/upperFirst'

import { CONCEPT_TYPES, PSEUDO_FIELDS } from '../constants'

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

  // CMR concepts which are multiple words i.e. order-option, data-quality-summary etc
  const camelCasedConcepts = [
    'aclGroup',
    'dataQualitySummary',
    'groupMember',
    'orderOption',
    'tagDefinition'
  ]

  let formattedConceptName = conceptName

  // Name will match the query, if the query is plural we have a slightly different
  // response and we need to handle it
  if (name.slice(-1) === 's') {
    if (!camelCasedConcepts.includes(conceptName)) {
      formattedConceptName = conceptName.toLowerCase()
    }

    if (name === 'revisions') {
      formattedConceptName = `${conceptName}Revision`
    }

    isList = true
    const {
      [`${upperFirst(formattedConceptName)}List`]: conceptListKeysRequested
    } = fieldsByTypeName

    const {
      count,
      cursor,
      items = {},
      facets
    } = conceptListKeysRequested;

    ({ fieldsByTypeName } = items)
    // If the user requested `count`, `cursor` or `facets` and no other fields, default the requested fields
    // to convince graph that it should still make a request
    if ((count || cursor || facets) && isEmpty(items)) {
      requestedFields = ['conceptId']
    }

    // Track meta keys for analytics on how often they are requested
    if (cursor) metaKeys.push(`${formattedConceptName}Cursor`)

    // If count was requested, append the specific concept for logging specificity
    if (count) metaKeys.push(`${formattedConceptName}Count`)

    // If facets were included append the facet metakey
    if (facets) metaKeys.push(`${formattedConceptName}Facets`)
  }

  // If a plural query is being performed, and the user has not requested any
  // fields (e.g. only count) then fieldsByTypeName will be undefined and we can ignore it
  if (fieldsByTypeName) {
    // Subscriptions are special because they are a reserved word in GraphQL
    // and cannot be used as a type name. So when `subscription` is used as a type name
    // we need to use `SearchSubscription` instead.
    let normalizedConceptName = conceptName

    if (conceptName === 'subscription') {
      normalizedConceptName = 'SearchSubscription'
    }

    const {
      [upperFirst(normalizedConceptName)]: conceptKeysRequested
    } = fieldsByTypeName

    if (conceptKeysRequested) {
      // Match by name field to allow field-level aliases
      requestedFields = map(conceptKeysRequested, 'name')
    }

    const {
      [`${upperFirst(formattedConceptName)}MutationResponse`]: ingestKeysRequested
    } = fieldsByTypeName

    if (ingestKeysRequested) {
      // If the type is a mutation response we only need to return the ingest keys
      return {
        ingestKeys: Object.keys(ingestKeysRequested)
      }
    }
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

  if (name === 'granule' || name === 'granules') {
    // If a user has requested the collection when making a granule query, but has not requested the
    // collectionConceptId, push the collection conceptId onto the requested fields.
    if (requestedFields.includes('collection') && !requestedFields.includes('collectionConceptId')) {
      requestedFields.push('collectionConceptId')
    }
  }

  if (name === 'collection' || name === 'collections') {
    // If a user has requested granules, subscriptions, relatedCollections,
    // duplicateCollections or generateVariableDrafts from
    // within a collection request the resolver will pull the conceptId and provide
    // it to the granules request but if a user doesn't explicity ask for the
    // collection concept id we need to request it
    if (
      (
        requestedFields.includes('granules')
        || requestedFields.includes('duplicateCollections')
        || requestedFields.includes('generateVariableDrafts')
        || requestedFields.includes('relatedCollections')
        || requestedFields.includes('revisions')
        || requestedFields.includes('subscriptions')
        || requestedFields.includes('visualizations')
        || requestedFields.includes('citations')
      )
       && !requestedFields.includes('conceptId')) {
      requestedFields.push('conceptId')
    }

    // If the user has requested duplicateCollections but hasn't requested shortName, add it to requestedFields
    // to be used in the duplicateCollections graphDb call
    if (requestedFields.includes('duplicateCollections') && !requestedFields.includes('shortName')) {
      requestedFields.push('shortName')
    }

    // If the user has requested duplicateCollections but hasn't requested doi, add it to requestedFields
    // to be used in the duplicateCollections graphDb call
    if (requestedFields.includes('duplicateCollections') && !requestedFields.includes('doi')) {
      requestedFields.push('doi')
    }
  }

  if (requestedFields.includes('tagDefinitions') && !requestedFields.includes('tags')) {
    requestedFields.push('tags')
  }

  if (name === 'subscriptions') {
    // If a user has requested collection, from within a subscriptions request the resolver
    // will pull the collectionConceptId and provide it to the subscriptions request but if a user
    // doesn't explicity ask for the collection concept id we need to request it
    if (requestedFields.includes('collection') && !requestedFields.includes('collectionConceptId')) {
      requestedFields.push('collectionConceptId')
    }
  }

  if (name === 'services') {
    // If a user has requested maxItemsPerOrder, from within a service request the resolver
    // will pull the providerId and type and provide it to the maxItemsPerOrder request but if a user
    // doesn't explicity ask for those fields we need to request them
    if (requestedFields.includes('maxItemsPerOrder') && !requestedFields.includes('providerId')) {
      requestedFields.push('providerId')
    }

    if (requestedFields.includes('maxItemsPerOrder') && !requestedFields.includes('type')) {
      requestedFields.push('type')
    }

    // If a user has requested collections, from
    // within a service request the resolver will pull the conceptId and provide
    // it to the collections request but if a user doesn't explicity ask for the
    // collection concept id we need to request it
    if (
      (
        requestedFields.includes('collections')
      )
       && !requestedFields.includes('conceptId')) {
      requestedFields.push('conceptId')
    }
  }

  if (name === 'variables') {
    // If a user has requested collections, from
    // within a variable request the resolver will pull the conceptId and provide
    // it to the collections request but if a user doesn't explicity ask for the
    // collection concept id we need to request it
    if (
      (
        requestedFields.includes('collections')
      )
       && !requestedFields.includes('conceptId')) {
      requestedFields.push('conceptId')
    }
  }

  if (name === 'tools') {
    // If a user has requested collections, from
    // within a tool request the resolver will pull the conceptId and provide
    // it to the collections request but if a user doesn't explicity ask for the
    // collection concept id we need to request it
    if (
      (
        requestedFields.includes('collections')
      )
       && !requestedFields.includes('conceptId')) {
      requestedFields.push('conceptId')
    }
  }

  const { sharedKeys = [], ummKeyMappings = {} } = keyMap

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

  // Requested keys that are not UMM and not CONCEPT_TYPES keys must be json
  const jsonKeys = requestedFields.filter((field) => (
    !ummKeys.includes(field)
    && !CONCEPT_TYPES.includes(field)
    && !PSEUDO_FIELDS.includes(field)
  ))

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

  // If facets were requested, we need to ensure we have at least 1 json key
  // some do because facets are not available from the umm endpoint
  if (metaKeys.includes('collectionFacets') && jsonKeys.length === 0) {
    jsonKeys.push('conceptId')

    // Remove the concept id from the ummKeys (if it exists) because we just moved it to the jsonKeys
    ummKeys = ummKeys.filter((e) => e !== 'conceptId')
  }

  // List of keys in ummKeyMappings, which have values starting with 'meta.'
  const ummMetaKeys = Object.keys(ummKeyMappings).filter((key) => ummKeyMappings[key].startsWith('meta.'))

  // If ummKeys contains any key that is in metaDotKeys, we need to fetch
  // all revisions in case a particular revision is requested to get the requested meta field, since
  // the response of the 'concepts' endpoint in CMR doesn't have meta fields.
  const fetchUmmRevisions = ummKeys.some((key) => ummMetaKeys.includes(key) && !['conceptId', 'revisionId'].includes(key))

  // Sort the keys to prevent fragility in testing
  return {
    jsonKeys: jsonKeys.sort(),
    metaKeys,
    ummKeys: ummKeys.sort(),
    ummKeyMappings,
    ummMetaKeys,
    isList,
    fetchUmmRevisions
  }
}
