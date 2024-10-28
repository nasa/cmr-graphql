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

    statusCode = status

    const { error = 'Unknown Error' } = data;

    ({ errors: errorArray = [error] } = data)

    if (shouldLog) {
      // Log each error provided. Account for when error is a string and
      // for when error is an object with both path and [errors]
      errorArray = errorArray.map((message) => {
        if (typeof message === 'string') {
          console.log(`${name} (${statusCode}): ${message}`)

          return message
        }

        console.log(`${name} (${statusCode}): ${JSON.stringify(message)}`)

        const { path, errors } = message
        const parsedErrorPath = path.map((item) => (typeof item === 'number' ? `[${item}] > ` : item)).join('')

        return [`Location: ${parsedErrorPath}`, errors]
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
