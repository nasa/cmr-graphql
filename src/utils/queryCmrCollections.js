import snakeCaseKeys from 'snakecase-keys'

import { pick } from 'lodash'

import { queryCmrUmmConcept } from './queryCmrUmmConcept'

/**
 * Query CMR for collection metadata, return the parsed response
 * @param {Object} params Parameters requested by the user
 * @param {Object} headers Headers provided from the user request
 */
export const queryCmrCollections = (params, headers, requestInfo) => {
  // Pick out permitted parameters
  const permittedSearchParams = pick(snakeCaseKeys(params), [
    'bounding_box',
    'circle',
    'concept_id',
    'has_granules_or_cwic',
    'has_granules',
    'include_has_granules',
    'include_tags',
    'offset',
    'page_size',
    'point',
    'polygon',
    'short_name',
    'sort_key',
    'temporal'
  ])

  return queryCmrUmmConcept('collections', permittedSearchParams, {
    ...headers,
    Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummCollectionVersion}`
  }, requestInfo)
}
