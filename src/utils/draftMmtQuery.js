import https from 'https'
import axios from 'axios'
import fs from 'fs'

import snakeCaseKeys from 'snakecase-keys'

import { pick } from 'lodash'
import { prepKeysForCmr } from './prepKeysForCmr'

/**
 * Make a request to Draft MMT and return the promise
 * @param {Object} params
 * @param {Object} params.headers Headers to send to Draft MMT
 * @param {Array} params.nonIndexedKeys Parameter names that should not be indexed before sending to Draft MMT
 * @param {Object} params.params Parameters to send to Draft MMT
 * @param {String} params.conceptType Concept type to search
 */
export const draftMmtQuery = ({
  conceptType,
  headers,
  nonIndexedKeys = [],
  params
}) => {
  // Default headers
  const defaultHeaders = {}

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pick({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Authorization',
    'Client-Id',
    'X-Request-Id'
  ])

  const cmrParameters = prepKeysForCmr(snakeCaseKeys(params), nonIndexedKeys)

  const { id } = params

  const { 'X-Request-Id': requestId } = permittedHeaders


  console.log('🚀 ~ file: draftMmtQuery.js ~ line 49 ~ process.env.sslCertFile', process.env.sslCertFile)
  const certFile = fs.readFileSync(process.env.sslCertFile)
  console.log('🚀 ~ file: draftMmtQuery.js ~ line 47 ~ certFile', certFile)
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // (NOTE: this will disable client verification)
    // cert: fs.readFileSync('./usercert.pem'),
    cert: certFile
    // key: fs.readFileSync('./key.pem')
    // passphrase: 'YYY'
  })
  console.log('🚀 ~ file: draftMmtQuery.js ~ line 55 ~ httpsAgent', httpsAgent)

  const requestConfiguration = {
    data: cmrParameters,
    headers: permittedHeaders,
    method: 'GET',
    url: `${process.env.draftMmtRootUrl}/collection_draft_proposals/${id}/download_json`,
    httpsAgent
  }

  // Interceptors require an instance of axios
  const instance = axios.create({ httpsAgent })
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

    console.log(`Request ${requestId} to [concept: ${conceptType}] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
