import snakeCaseKeys from 'snakecase-keys'

import { pick } from 'lodash'

import { queryCmrUmmConcept } from './queryCmrUmmConcept'

/**
 * Query CMR for tool metadata, return the parsed response
 * @param {Object} params Parameters requested by the user
 * @param {Object} headers Headers provided from the user request
 */
export const queryCmrTools = (params, headers, requestInfo) => {
  // Pick out permitted parameters
  const permittedSearchParams = pick(snakeCaseKeys(params), [
    'concept_id',
    'offset',
    'page_size'
  ])

  return queryCmrUmmConcept('tools', permittedSearchParams, {
    ...headers,
    Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummToolVersion}`
  }, requestInfo)
}
