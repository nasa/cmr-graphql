import { rule } from 'graphql-shield'

import { downcaseKeys } from '../../utils/downcaseKeys'
import { isOfflineMMT } from '../../utils/isOfflineMMT'

/**
 * Check to see if the request is made while running in dev mode (AWS_SAM_LOCAL === 'true'),
 * and is coming from the local MMT (token ABC-1).
 */
export const isLocalMMT = rule()(async (parent, params, context) => {
  const { headers } = context

  const {
    authorization: token
  } = downcaseKeys(headers)

  return isOfflineMMT(token)
})
