import { pick } from 'lodash'

import { queryCmr } from './queryCmr'

/**
 * Query CMR for granule metadata, return the parsed response
 * @param {Object} params Parameters requested by the user
 * @param {Object} headers Headers provided from the user request
 */
export const queryCmrGranules = async (params, headers) => {
  // Pick out permitted parameters
  const permittedParams = pick(params, [
    'collection_concept_id',
    'page_size'
  ])

  return queryCmr('granules', permittedParams, headers)
}
