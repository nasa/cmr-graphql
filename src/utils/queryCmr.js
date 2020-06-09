import axios from 'axios'

import snakeCaseKeys from 'snakecase-keys'

import { pick } from 'lodash'
import { stringify } from 'qs'

/**
 * Make a request to CMR and return the promise
 * @param {String} conceptType Concept type to search
 * @param {Object} params Parameters to send to CMR
 * @param {Object} headers Headers to send to CMR
 */
export const queryCmr = (conceptType, params, headers, options = {}) => {
  const {
    format = 'json'
  } = options

  // Default headers
  const defaultHeaders = {}

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pick({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Client-Id',
    'CMR-Request-ID',
    'Echo-Token'
  ])

  const cmrParameters = stringify(
    snakeCaseKeys(params), { indices: false, arrayFormat: 'brackets' }
  )

  const { 'CMR-Request-ID': requestId } = permittedHeaders

  const requestConfiguration = {
    data: cmrParameters,
    headers: permittedHeaders,
    method: 'POST',
    url: `${process.env.cmrRootUrl}/search/${conceptType}.${format}`
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

    // Retrieve the reported timing from CMR
    const { headers } = response
    const { 'cmr-took': cmrTook } = headers
    response.headers['request-duration'] = milliseconds

    console.log(`Request ${requestId} to [concept: ${conceptType}, format: ${format}] completed external request in [reported: ${cmrTook} ms, observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
