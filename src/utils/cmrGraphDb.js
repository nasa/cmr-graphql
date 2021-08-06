import axios from 'axios'
import { pick } from 'lodash'

/**
 * Make a request to CMR and return the promise.
 * @param {Object} params
 * @param {Object} params.headers Headers to send to CMR.
 * @param {String} params.conceptId Concept ID that is being searched on.
 * @param {String} params.query GraphDB query to search with.
 */
export const cmrGraphDb = ({
  conceptId,
  headers,
  query
}) => {
  // Default headers
  const defaultHeaders = {}

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pick({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Authorization',
    'Client-Id',
    'CMR-Request-Id',
    'Echo-Token'
  ])

  // If both authentication headers are provided favor Authorization
  if (
    Object.keys(permittedHeaders).includes('Authorization')
    && Object.keys(permittedHeaders).includes('Echo-Token')
  ) {
    delete permittedHeaders['Echo-Token']
  }

  const { 'CMR-Request-Id': requestId } = permittedHeaders

  const requestConfiguration = {
    data: query,
    headers: permittedHeaders,
    method: 'POST',
    url: `${process.env.cmrRootUrl}/graphdb`
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

    console.log(`Request ${requestId} to [graphdb conceptId: ${conceptId}] completed external request in [reported: ${cmrTook} ms, observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
