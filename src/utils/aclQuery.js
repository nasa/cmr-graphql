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
  conceptType,
  headers,
 // nonIndexedKeys = [],
  options = {},
  params
}) => {
  const {
    format = 'json'
  } = options

  console.log('export aclQuery1')
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
  ])

//   const aclParameters = prepKeysForCmr(snakeCaseKeys(params))

  const {
  } = downcaseKeys(permittedHeaders)

  const requestConfiguration = {
    // data: aclParameters,
    headers: permittedHeaders,
    method: 'GET',
    url: `${process.env.cmrRootUrl}/access-control/acls`
    // url: `${process.env.cmrRootUrl}/access-control/acls?permitted_user=ttle9`
    // url: `${process.env.aclServiceUrl}/acl.${format}`
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
    const end = process.hrtime(start);
    const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))

    
    // Log request duration
    // console.log(`ACL Request ${requestId} from ${clientId} completed in ${milliseconds} ms`)
    //console.log(`response @@@`, response)
    console.log(`this is aclQuery Response@@@`, response)
    console.log('I am aclQuery')
    return response
  })
  

  return instance.request(requestConfiguration);
}
