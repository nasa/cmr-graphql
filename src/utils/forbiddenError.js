import { GraphQLError } from 'graphql'

/**
 * Returns a GraphQLError with a code of FORBIDDEN
 * @param {String} message Message to include in the error
 */
export const forbiddenError = (message) => new GraphQLError(message, {
  extensions: {
    code: 'FORBIDDEN'
  }
})
