import axios from 'axios'

import pascalCaseKeys from 'pascalcase-keys'

import { pickIgnoringCase } from './pickIgnoringCase'

/**
 * Make a DELETE request to CMR and return the promise
 * @param {String} conceptType Concept type to delete
 * @param {Object} data Parameters to send to CMR
 * @param {Object} headers Headers to send to CMR
 * @param {String} ingestPath CMR path to call to delete concept
 */
export const cmrDelete = async (conceptType, data, headers, ingestPath) => {
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
    'CMR-Request-Id'
  ])

  // Use the provided native id
  const { nativeId } = data

  // Remove native id as it is not a supported key in umm
  // eslint-disable-next-line no-param-reassign
  delete data.nativeId

  const cmrParameters = pascalCaseKeys(data)

  const { 'CMR-Request-Id': requestId } = permittedHeaders

  const requestConfiguration = {
    data: cmrParameters,
    headers: permittedHeaders,
    method: 'DELETE',
    url: `${process.env.cmrRootUrl}/ingest/${ingestPath}/${nativeId}`
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

    console.log(`Request ${requestId} to delete [concept: ${conceptType}] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
