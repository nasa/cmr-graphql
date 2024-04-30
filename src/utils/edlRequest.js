import axios from 'axios'
import snakeCaseKeys from 'snakecase-keys'

import { buildEdlGroupPath } from './buildEdlGroupPath'
import { downcaseKeys } from './downcaseKeys'
import { mergeParams } from './mergeParams'
import { pickIgnoringCase } from './pickIgnoringCase'
import { prepKeysForCmr } from './prepKeysForCmr'

/**
 * Make a request to EDL and return the promise
 * @param {Object} params
 * @param {Object} params.context GraphQL context object
 * @param {String} params.method Method to make the request with
 * @param {Object} params.params Parameters to send to CMR
 * @param {String} params.pathType Type of path, used to build correct EDL path for request
 * @param {Object} params.requestInfo Parsed GraphQL request info
 */
export const edlRequest = ({
  context,
  method,
  params,
  pathType,
  requestInfo
}) => {
  const { headers, edlClientToken } = context
  let { params: requestParams } = params

  // For mutations, params are not nested
  requestParams = mergeParams({ ...params })

  // Default headers
  const defaultHeaders = {}

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pickIgnoringCase({
    ...defaultHeaders,
    ...headers,
    Authorization: `Bearer ${edlClientToken}`
  }, [
    'Accept',
    'Authorization',
    'Client-Id',
    'X-Request-Id'
  ])

  const { id, ...filteredParams } = requestParams

  const nonIndexedKeys = ['user_ids', 'tags']
  const edlParameters = prepKeysForCmr(snakeCaseKeys(filteredParams), nonIndexedKeys)

  const {
    'client-id': clientId,
    'x-request-id': requestId
  } = downcaseKeys(permittedHeaders)

  // Log out requested keys
  const keys = requestInfo.jsonKeys.concat(requestInfo.metaKeys)
  keys.forEach((key) => {
    console.log(`Request ${requestId} from ${clientId} to [concept: groups] requested [format: json, key: ${key}]`)
  })

  const requestConfiguration = {
    headers: permittedHeaders,
    method,
    url: process.env.ursRootUrl
  }

  requestConfiguration.url += buildEdlGroupPath({
    id,
    params: edlParameters,
    type: pathType
  })

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

    console.log(`Request ${requestId} from ${clientId} to [concept: groups] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
