import { GraphQLError } from 'graphql'

/**
 * Parse and return a lambda friendly response to errors
 * @param {Object} errorObj The error object that was thrown
 * @param {Boolean} shouldLog Whether or not to log the exceptions found
 */
export const parseError = (errorObj, {
  shouldLog = true,
  asJSON = true,
  reThrowError = false,
  provider = 'CMR'
} = {}) => {
  const {
    name = 'Error',
    response
  } = errorObj

  let errorArray = []
  let statusCode = 500

  if (response) {
    const {
      data,
      status
    } = response

    statusCode = status;

    ({ errors: errorArray = ['Unknown Error'] } = data)

    if (shouldLog) {
      // Log each error provided
      errorArray.forEach((message) => {
        console.log(`${name} (${statusCode}): ${message}`)
      })
    }
  } else {
    if (shouldLog) {
      console.log(errorObj.toString())
    }

    errorArray = [errorObj.toString()]
  }

  // If the error needs to be thrown again, do so before returning
  if (reThrowError) {
    throw new GraphQLError(errorArray, {
      extensions: {
        code: `${provider}_ERROR`
      }
    })
  }

  if (asJSON) {
    return {
      statusCode,
      body: JSON.stringify({
        statusCode,
        errors: errorArray
      })
    }
  }

  return errorArray
}
