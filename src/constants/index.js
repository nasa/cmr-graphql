/**
 * List of supported CMR concept types or objects that will require overrides to the user input internally
 */
export const CONCEPT_TYPES = [
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
  'variables'
]

/**
 * List of supported pseudo fields, these fields aren't a real CMR concept, but are still supported by separate queries
 */
export const PSEUDO_FIELDS = [
  'maxItemsPerOrder'
]

/**
 * Draft concept ID prefixes
 */
export const DRAFT_CONCEPT_ID_PREFIXES = {
  collection: 'CD',
  service: 'SD',
  tool: 'TD',
  variable: 'VD'
}
