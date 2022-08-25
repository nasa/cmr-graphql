import axios from 'axios'

import { pickIgnoringCase } from './pickIgnoringCase'

/**
 * Make a request to CMR and return the promise.
 * @param {Object} params
 * @param {String} params.conceptId Concept ID that is being searched on.
 * @param {Object} params.headers Headers to send to CMR.
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
  const permittedHeaders = pickIgnoringCase({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Client-Id',
    'CMR-Request-Id'
  ])

  const { 'CMR-Request-Id': requestId } = permittedHeaders
  // TODO: this is searching off of the grphDb endpoint which we will need to change later
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

    response.headers['request-duration'] = milliseconds

    console.log(`Request ${requestId} to [graphdb conceptId: ${conceptId}] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
