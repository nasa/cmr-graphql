import https from 'https'
import axios from 'axios'

import snakeCaseKeys from 'snakecase-keys'

import { downcaseKeys } from './downcaseKeys'
import { pickIgnoringCase } from './pickIgnoringCase'
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
  const permittedHeaders = pickIgnoringCase({
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

  const {
    'client-id': clientId,
    'x-request-id': requestId
  } = downcaseKeys(permittedHeaders)

  let httpsAgent

  // Only use the dmmtSslCert if it has been defined
  if (process.env.dmmtSslCert && process.env.dmmtSslCert !== 'false') {
    const { dmmtSslCert } = process.env

    // Adds additional CA certificate for requests to Draft MMT
    httpsAgent = new https.Agent({
      // In order to format the cert correctly when loading from a bamboo variable,
      // we need to replace spaces with new lines, except when the space is followed by `CERTIFICATE`
      ca: dmmtSslCert.replace(/[\s](?!CERTIFICATE)/g, '\n')
    })
  }

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

    console.log(`Request ${requestId} from ${clientId} to [concept: ${conceptType}] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
