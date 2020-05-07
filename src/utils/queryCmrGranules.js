import { pick } from 'lodash'

import { queryCmrUmmConcept } from './queryCmrUmmConcept'

/**
 * Query CMR for granule metadata, return the parsed response
 * @param {Object} params Parameters requested by the user
 * @param {Object} headers Headers provided from the user request
 */
export const queryCmrGranules = (params, headers, requestInfo) => {
  // Pick out permitted parameters
  const permittedSearchParams = pick(params, [
    'collection_concept_id',
    'concept_id',
    'page_size'
  ])

  return queryCmrUmmConcept('granules', permittedSearchParams, {
    ...headers,
    Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummGranuleVersion}`
  }, requestInfo)
}
