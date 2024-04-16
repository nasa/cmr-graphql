import axios from 'axios'

import { downcaseKeys } from './downcaseKeys'
import { pickIgnoringCase } from './pickIgnoringCase'

/**
 * Make a DELETE request to CMR and return the promise
 * @param {String} conceptType Concept type to delete
 * @param {Object} data Parameters to send to CMR
 * @param {Object} headers Headers to send to CMR
 */
export const cmrDelete = async ({
  conceptType,
  data,
  headers,
  options = {}
}) => {
  // Default headers
  const defaultHeaders = {
    Accept: 'application/json'
  }

  // Use the provided native id and provider id
  const { providerId, nativeId } = data

  // Remove native id as it is not a supported key in umm
  // eslint-disable-next-line no-param-reassign
  delete data.nativeId

  // eslint-disable-next-line no-param-reassign
  delete data.providerId

  // Default options
  const {
    path = `ingest/providers/${providerId}/${conceptType}/${nativeId}`
  } = options

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pickIgnoringCase({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Authorization',
    'Client-Id',
    'Content-Type',
    'CMR-Request-Id'
  ])

  const {
    'client-id': clientId,
    'cmr-request-id': requestId
  } = downcaseKeys(permittedHeaders)

  const requestConfiguration = {
    data,
    headers: permittedHeaders,
    method: 'DELETE',
    url: `${process.env.cmrRootUrl}/${path}`
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

    console.log(`Request ${requestId} from ${clientId} to delete [concept: ${conceptType}] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
