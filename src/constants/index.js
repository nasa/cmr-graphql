/**
 * List of supported CMR concept types or objects that will require overrides to the user input internally
 */
export const CONCEPT_TYPES = [
  'citations',
  'collections',
  'dataQualitySummaries',
  'duplicateCollections',
  'generateVariableDrafts',
  'granules',
  'grids',
  'orderOptions',
  'relatedCollections',
  'services',
  'subscriptions',
  'tools',
  'variables',
  'visualizations'
]

/**
 * List of supported pseudo fields, these fields aren't a real CMR concept, but are still supported by separate queries.
 * Adding the field to this list will keep it out of being added to `jsonKeys` and triggering a CMR json endpoint call.
 */
export const PSEUDO_FIELDS = [
  'maxItemsPerOrder',
  'revisions'
]

/**
 * Draft concept ID prefixes
 */
export const DRAFT_CONCEPT_ID_PREFIXES = {
  citation: 'CITD',
  collection: 'CD',
  service: 'SD',
  tool: 'TD',
  variable: 'VD',
  visualization: 'VISD'
}

/**
 * Types of requests that can be sent to EDL
 */
export const edlPathTypes = {
  CREATE_GROUP: 'CREATE_GROUP',
  DELETE_GROUP: 'DELETE_GROUP',
  FIND_GROUP: 'FIND_GROUP',
  FIND_MEMBERS: 'FIND_MEMBERS',
  SEARCH_GROUPS: 'SEARCH_GROUPS',
  UPDATE_GROUP: 'UPDATE_GROUP'
}
