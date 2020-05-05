import axios from 'axios'
import { pick } from 'lodash'
import { stringify } from 'qs'

/**
 * Make a request to CMR and return the promise
 * @param {String} conceptType Concept type to search
 * @param {Object} params Parameters to send to CMR
 * @param {Object} headers Headers to send to CMR
 */
export const queryCmr = async (conceptType, params, headers, options = {}) => {
  const {
    format = 'json'
  } = options

  // Default headers
  const defaultHeaders = {}

  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pick({
    ...defaultHeaders,
    ...headers
  }, [
    'Client-Id',
    'CMR-Request-ID',
    'Echo-Token'
  ])

  const cmrParameters = stringify(params, { indices: false, arrayFormat: 'brackets' })

  const { 'CMR-Request-ID': requestId } = permittedHeaders

  console.log(`[${requestId}] Request to ${conceptType}.${format}`)

  // Construct the configuration object we'll provide to axios
  const requestConfiguration = {
    data: cmrParameters,
    headers: permittedHeaders,
    method: 'POST',
    url: `${process.env.cmrRootUrl}/search/${conceptType}.${format}`
  }

  return axios(requestConfiguration)
}
