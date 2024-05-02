import { rule } from 'graphql-shield'

import { downcaseKeys } from '../../utils/downcaseKeys'

/**
 * Check to see if the request is made while running in dev mode (IS_OFFLINE),
 * and is coming from the MMT's local admin (token ABC-1).
 */
export const isLocalMMTAdmin = rule()(async (parent, params, context) => {
  const { headers } = context

  const {
    authorization: token
  } = downcaseKeys(headers)

  if (process.env.IS_OFFLINE && token === 'ABC-1') return true

  return false
})
