import snakeCaseKeys from 'snakecase-keys'

import { pick } from 'lodash'

import { queryCmrUmmConcept } from './queryCmrUmmConcept'

/**
 * Query CMR for service metadata, return the parsed response
 * @param {Object} params Parameters requested by the user
 * @param {Object} headers Headers provided from the user request
 */
export const queryCmrServices = (params, headers, requestInfo) => {
  // Pick out permitted parameters
  const permittedSearchParams = pick(snakeCaseKeys(params), [
    'concept_id',
    'page_size'
  ])

  return queryCmrUmmConcept('services', permittedSearchParams, {
    ...headers,
    Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummServiceVersion}`
  }, requestInfo)
}
