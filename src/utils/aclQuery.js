import axios from 'axios'
import { downcaseKeys } from './downcaseKeys'
import { pickIgnoringCase } from './pickIgnoringCase'

/**
 * Make a request to retrieve ACL information and return the promise
 * @param {Object} params
 * @param {Object} params.headers Headers to send to the ACL service
 * @param {Object} params.options Additional Options (format)
 * @param {Object} params.params Parameters to send to the ACL service
 */
// export const aclQuery = ({ headers }) => {
//   console.log('aclquery@@')

export const aclQuery = ({
  conceptType, // May not use it later
  headers,
  // NonIndexedKeys = [],
  options = {},
  params
}) => {
  const {
    format = 'json'
  } = options

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
    'CMR-Request-Id'
  ])

  const requestConfiguration = {
    // Data: aclParameters,
    headers: permittedHeaders,
    method: 'GET',
    url: `${process.env.cmrRootUrl}/access-control/acls?permitted_user=typical`
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
    console.log('🚀 ~ responseInterceptor.use ~ response:', response)
    // Determine total time to complete this request
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))

    // Log request duration

    return response
  })

  return instance.request(requestConfiguration)
}
