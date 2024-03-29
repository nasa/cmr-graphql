import { GraphQLError } from 'graphql'

import { downcaseKeys } from './downcaseKeys'

/**
 * Parse an error thrown from within a CMR datasource
 * @param {Object} error Error thrown
 */
export const parseCmrError = (error, reThrow = true) => {
  const { response } = error

  if (response == null) return {}

  const {
    data,
    headers,
    status
  } = response

  const { errors } = data

  const {
    'client-id': clientId,
    'cmr-request-id': requestId
  } = downcaseKeys(headers)

  errors.forEach((logError) => {
    console.log(`Request ${requestId} from ${clientId} experienced an error: ${logError}`)
  })

  if (reThrow) {
    const [firstMessage] = errors

    if (status === 401) {
      throw new GraphQLError(firstMessage, {
        extensions: {
          code: 'UNAUTHENTICATED'
        }
      })
    }

    // If not one of Apollo's predefined errors throw our own
    // https://www.apollographql.com/docs/apollo-server/data/errors/
    throw new GraphQLError(firstMessage, {
      extensions: {
        code: 'CMR_ERROR'
      }
    })
  }

  return data
}
