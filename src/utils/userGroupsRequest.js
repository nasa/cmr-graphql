import axios from 'axios'
import snakeCaseKeys from 'snakecase-keys'

import { downcaseKeys } from './downcaseKeys'
import { pickIgnoringCase } from './pickIgnoringCase'
import { prepKeysForCmr } from './prepKeysForCmr'

/**
 * Make a request to EDL and return the promise
 * @param {Object} params
 * @param {Object} params.headers Headers to send to CMR
 * @param {String} params.method Method to make the request with
 * @param {Object} params.params Parameters to send to CMR
 */
export const userGroupsRequest = ({
  headers,
  method,
  params
}) => {
  let { params: requestParams } = params

  // For mutations, params are not nested
  if (!requestParams) requestParams = params

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
    'CMR-Request-Id',
    'CMR-Search-After'
  ])

  const { id, userGroupIdOrName } = requestParams

  requestParams = {
    ...requestParams,
    userGroupIdOrName: undefined
  }

  const nonIndexedKeys = ['user_ids', 'tags']
  const edlParameters = prepKeysForCmr(snakeCaseKeys(requestParams), nonIndexedKeys)

  const {
    'client-id': clientId,
    'cmr-request-id': requestId
  } = downcaseKeys(permittedHeaders)

  console.log(`Request ${requestId} from ${clientId} to [concept: userGroups] requested [format: json]`)

  const requestConfiguration = {
    headers: permittedHeaders,
    method,
    url: process.env.ursRootUrl
  }

  if (method === 'GET') {
    if (userGroupIdOrName) {
      // Find single user group
      requestConfiguration.url += `/api/user_groups/${userGroupIdOrName}?${edlParameters}`
    } else {
      // Search user groups
      requestConfiguration.url += `/api/user_groups/search?${edlParameters}`
    }
  }

  if (method === 'POST') {
    if (userGroupIdOrName) {
      // Update user group
      requestConfiguration.url += `/api/user_groups/${userGroupIdOrName}/update?${edlParameters}`
    } else {
      // Create user group
      requestConfiguration.url += `/api/user_groups?${edlParameters}`
    }
  }

  if (method === 'DELETE') {
    // Delete user group
    requestConfiguration.url += `/api/user_groups/${id}`
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

    console.log(`Request ${requestId} from ${clientId} to [concept: userGroups] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
