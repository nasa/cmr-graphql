import { ApolloError, AuthenticationError } from 'apollo-server-lambda'

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

  errors.forEach((error) => {
    console.log(`Request ${requestId} from ${clientId} experienced an error: ${error}`)
  })

  if (reThrow) {
    const [firstMessage] = errors

    if (status === 401) {
      throw new AuthenticationError(firstMessage)
    }

    // If not one of Apollo's predefined errors throw our own
    // https://www.apollographql.com/docs/apollo-server/data/errors/
    throw new ApolloError(firstMessage, 'CMR_ERROR')
  }

  return data
}
