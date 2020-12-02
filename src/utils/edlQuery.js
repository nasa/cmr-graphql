import axios from 'axios'

import { pick } from 'lodash'

/**
 * Make a request to CMR and return the promise
 * @param {String} username EDL username to retrieve profile information for
 * @param {Object} headers Headers to send to CMR
 */
export const edlQuery = (username, headers) => {
  // Default headers
  const defaultHeaders = {}

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pick({
    ...defaultHeaders,
    ...headers
  }, [
    'Authorization'
  ])

  const requestConfiguration = {
    headers: permittedHeaders,
    method: 'GET',
    params: {
      calling_application: process.env.edlClientId
    },
    url: `${process.env.edlRootUrl}/api/users/${username}`
  }

  // Interceptors require an instance of axios
  const instance = axios.create()
  const { interceptors } = instance
  const {
    request: requestInterceptor,
    response: responseInterceptor
  } = interceptors

  // Intercept the request to inject timing information
  requestInterceptor.use((config) => {
    // eslint-disable-next-line no-param-reassign
    config.headers['request-startTime'] = process.hrtime()

    return config
  })

  responseInterceptor.use((response) => {
    // Determine total time to complete this request
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))

    response.headers['request-duration'] = milliseconds

    console.log(`Request to EDL completed in ${milliseconds} ms`)

    return response
  })

  return instance.request(requestConfiguration)
}
