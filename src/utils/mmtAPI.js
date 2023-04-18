import axios from 'axios'
import snakeCaseKeys from 'snakecase-keys'

import { downcaseKeys } from './downcaseKeys'
import { pickIgnoringCase } from './pickIgnoringCase'
import { prepKeysForCmr } from './prepKeysForCmr'

export const mmtAPI = ({
  draftType,
  headers,
  nonIndexedKeys = [],
  params
}) => {
  const defaultHeaders = {}

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

  const requestConfiguration = {
    data: cmrParameters,
    headers: permittedHeaders,
    method: 'GET',
    url: `${process.env.mmtRootUrl}/api/drafts/${id}?draft_type=${draftType}`
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

    console.log(`Request ${requestId} from ${clientId} to [draftType: ${draftType}] completed external request in [observed: ${milliseconds} ms]`)
    console.log('******ReSPONSE', response)
    return response
  })

  return instance.request(requestConfiguration)
}
