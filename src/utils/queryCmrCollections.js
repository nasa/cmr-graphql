import { pick } from 'lodash'

import { queryCmrUmmConcept } from './queryCmrUmmConcept'

/**
 * Query CMR for collection metadata, return the parsed response
 * @param {Object} params Parameters requested by the user
 * @param {Object} headers Headers provided from the user request
 */
export const queryCmrCollections = (params, headers, requestInfo) => {
  // Pick out permitted parameters
  const permittedSearchParams = pick(params, [
    'bounding_box',
    'circle',
    'concept_id',
    'page_size',
    'point',
    'polygon',
    'temporal'
  ])

  return queryCmrUmmConcept('collections', permittedSearchParams, {
    ...headers,
    Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummCollectionVersion}`
  }, requestInfo)
}
