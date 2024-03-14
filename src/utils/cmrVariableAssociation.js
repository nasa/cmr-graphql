import axios from 'axios'
import snakecaseKeys from 'snakecase-keys'
import { pickIgnoringCase } from './pickIgnoringCase'
import { downcaseKeys } from './downcaseKeys'

/**
 * Make a request to CMR and return the promise
 * @param {Object} params
 * @param {Object} params.headers Headers to send to CMR
 * @param {Array} params.nonIndexedKeys Parameter names that should not be indexed before sending to CMR
 * @param {Object} params.options Additional Options (format)
 * @param {Object} params.params Parameters to send to CMR
 * @param {String} params.conceptType Concept type to search
 */
export const cmrVariableAssociation = ({
  conceptType,
  data,
  headers
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
    'CMR-Request-Id',
    'Content-Type',
    'CMR-Search-After'
  ])

  const {
    'client-id': clientId,
    'cmr-request-id': requestId
  } = downcaseKeys(permittedHeaders)

  const {
    collectionConceptIds, nativeId, metadata
  } = data

  const { concept_id: collectionConcept } = snakecaseKeys(collectionConceptIds[0])

  const requestConfiguration = {
    data: metadata,
    headers: permittedHeaders,
    method: 'PUT',
    url: `${process.env.cmrRootUrl}/ingest/collections/${collectionConcept}/variables/${nativeId}. `
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

    console.log(`Request ${requestId} from ${clientId} to variable association [concept: ${conceptType}] completed external request in [observed: ${milliseconds} ms]`)

    return response
  })

  return instance.request(requestConfiguration)
}
