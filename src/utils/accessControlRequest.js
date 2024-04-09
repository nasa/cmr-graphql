import axios from 'axios'

import snakecaseKeys from 'snakecase-keys'
import { downcaseKeys } from './downcaseKeys'
import { pickIgnoringCase } from './pickIgnoringCase'
import { prepKeysForCmr } from './prepKeysForCmr'

/**
 * Make a request to CMR and return the promise
 * @param {Object} params
 * @param {Object} params.data Parameters to send to CMR
 * @param {Object} params.headers Headers to send to CMR
 * @param {String} params.method Method to make the request with
 * @param {String} params.path Path to make the request to
 */
export const accessControlRequest = ({
  headers,
  method,
  nonIndexedKeys,
  params,
  path
}) => {
  // Default headers
  const defaultHeaders = {
    Accept: 'application/json'
  }

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pickIgnoringCase({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Authorization',
    'Client-Id',
    'Content-Type',
    'CMR-Request-Id',
    'CMR-Search-After'
  ])

  const {
    'client-id': clientId,
    'cmr-request-id': requestId
  } = downcaseKeys(permittedHeaders)

  const requestConfiguration = {
    headers: permittedHeaders,
    method,
    url: `${process.env.cmrRootUrl}/access-control/${path}`
  }

  if (params) {
    if (['POST', 'PUT'].includes(method)) {
      requestConfiguration.data = snakecaseKeys(params)
    }

    if (method === 'GET') {
      const cmrParameters = prepKeysForCmr(snakecaseKeys(params), nonIndexedKeys)

      requestConfiguration.url += `?${cmrParameters}`
    }
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

    console.log(`Request ${requestId} from ${clientId} to access-control completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
