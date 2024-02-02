import axios from 'axios'
import { downcaseKeys } from './downcaseKeys'
import { pickIgnoringCase } from './pickIgnoringCase'

import snakeCaseKeys from 'snakecase-keys'
import { prepKeysForCmr } from './prepKeysForCmr'

/**
 * Make a request to retrieve ACL information and return the promise
 * @param {Object} params
 * @param {Object} params.headers Headers to send to the ACL service
 * @param {Object} params.options Additional Options (format)
 * @param {Object} params.params Parameters to send to the ACL service
 */

export const aclQuery = ({
  headers,
  nonIndexedKeys = [],
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
    'CMR-Request-Id',
    'CMR-Search-After'
  ])

  // console.log('🚀 ACLparams', params)
  const aclParameters = prepKeysForCmr(snakeCaseKeys(params), nonIndexedKeys)

  // console.log('🚀 aclParameters', aclParameters)

  const {
    'client-id': clientId,
    'cmr-request-id': requestId
  } = downcaseKeys(permittedHeaders)

  const requestConfiguration = {
    // data: aclParameters,
    headers: permittedHeaders,
    method: 'GET',
    // options: aclParameters,
    url: `${process.env.cmrRootUrl}/access-control/acls?${aclParameters}`
    // url: `${process.env.cmrRootUrl}/access-control/acls?permitted_user=typical&include_full_acl=true&page_size=20&page_num=1&target=PROVIDER_CONTEXT`
  }

  // console.log('Actual Request:', requestConfiguration)

// console.log('🚀 acl requestConfiguration.url', requestConfiguration.url)
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

  //if the response has providers ids then it is working
  responseInterceptor.use((response) => {
    // Determine total time to complete this request
    const start = response.config.headers['request-startTime']
    const end = process.hrtime(start)
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))

    // Retrieve the reported timing from CMR
    const { 'cmr-took': cmrTook } = downcaseKeys(response.headers)
    response.headers['request-duration'] = milliseconds

    console.log(`Request ${requestId} from ${clientId} to [format: ${format}] completed external request in [reported: ${cmrTook} ms, observed: ${milliseconds} ms]`)

    const { data } = response
     const { items } = data

    //  console.log('items  @@@', items[0]["acl"]["provider_identity"]["provider_id"])
    //  console.log(`@@@Acl response items@@@`, items)
     // console.log(`this is aclQuery Response@@@`, response)
    return response
  })

  return instance.request(requestConfiguration)
}
