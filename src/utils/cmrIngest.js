import axios from 'axios'

import pascalCaseKeys from 'pascalcase-keys'

import { v4 as uuidv4 } from 'uuid'

import { pickIgnoringCase } from './pickIgnoringCase'

/**
 * Make a request to CMR and return the promise
 * @param {String} conceptType Concept type to search
 * @param {Object} data Parameters to send to CMR
 * @param {Object} headers Headers to send to CMR
 */
export const cmrIngest = async (conceptType, data, headers) => {
  // Default headers
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/vnd.nasa.cmr.umm+json'
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
    'Echo-Token'
  ])

  // If both authentication headers are provided favor Authorization
  if (
    Object.keys(permittedHeaders).includes('Authorization')
    && Object.keys(permittedHeaders).includes('Echo-Token')
  ) {
    delete permittedHeaders['Echo-Token']
  }

  // Use the provided native id if one is provided, default to a guid
  const { collectionConceptId, nativeId = uuidv4() } = data

  // Use the string after '-' to determine the provider
  const [, provider] = collectionConceptId.split('-')

  // Remove native id as it is not a supported key in umm
  // eslint-disable-next-line no-param-reassign
  delete data.nativeId

  const cmrParameters = pascalCaseKeys(data)

  const { 'CMR-Request-Id': requestId } = permittedHeaders

  const requestConfiguration = {
    data: cmrParameters,
    headers: permittedHeaders,
    method: 'PUT',
    url: `${process.env.cmrRootUrl}/ingest/providers/${provider}/${conceptType}/${nativeId}`
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

    console.log(`Request ${requestId} to ingest [concept: ${conceptType}] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
