/**
 * List of supported CMR concept types
 */
export const CONCEPT_TYPES = [
  'collections',
  'duplicateCollections',
  'dataQualitySummaries',
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
