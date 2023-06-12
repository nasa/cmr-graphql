import axios from 'axios'

import { downcaseKeys } from './downcaseKeys'
import { pickIgnoringCase } from './pickIgnoringCase'

/**
 * Make a request to CMR-Ordering and return the promise
 * @param {Object} params
 * @param {Object} params.query cmr-ordering GraphQL query
 * @param {Object} params.variables cmr-ordering GraphQL variables
 * @param {Object} params.headers Headers to send to CMR
 */
export const cmrOrdering = ({
  query,
  variables,
  headers
}) => {
  // Default headers
  const defaultHeaders = {}

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pickIgnoringCase({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Authorization',
    'Client-Id',
    'X-Request-Id'
  ])

  const {
    'client-id': clientId,
    'x-request-id': requestId
  } = downcaseKeys(permittedHeaders)

  const requestConfiguration = {
    data: {
      query,
      variables
    },
    headers: permittedHeaders,
    method: 'POST',
    url: `${process.env.cmrRootUrl}/ordering/api`
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
    response.headers['request-duration'] = milliseconds

    console.log(`Request ${requestId} from ${clientId} to [cmrOrdering] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
