import axios from 'axios'
import { pickIgnoringCase } from './pickIgnoringCase'
/**
 * Make a request to CMR and return the promise.
 * @param {Object} params
 * @param {String} params.conceptId Concept ID that is being searched on.
 * @param {Object} params.headers Headers to send to CMR.
 */
export const getGroups = ({
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
    'Client-Id',
    'CMR-Request-Id',
    'Authorization'
  ])
  console.log(headers)
  // Useful for debugging
  // const response = axios.get('https://cmr.earthdata.nasa.gov/access-control/acls/')
  // const items = response
  permittedHeaders.Authorization = process.env.localHeader
  console.log('Header after changing it to mock echo for local dev', permittedHeaders)

  const requestConfiguration = {
    headers: permittedHeaders,
    method: 'GET',
    url: `${process.env.cmrRootUrlTest}/groups`
  }
  // Interceptors require an instance of axios
  const instance = axios.create()
  const { interceptors } = instance
  const {
    request: requestInterceptor,
    response: responseInterceptor
  } = interceptors
  return instance.request(requestConfiguration)
}
export const getGroup = ({
  headers,
  groupConceptId
}) => {
  // Default headers
  const defaultHeaders = {}
  // Merge default headers into the provided headers and then pick out only permitted values
  const permittedHeaders = pickIgnoringCase({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Client-Id',
    'CMR-Request-Id',
    'Authorization'
  ])
  // Useful for debugging
  // console.log(headers)
  // const response = axios.get('https://cmr.earthdata.nasa.gov/access-control/acls/')
  permittedHeaders.Authorization = process.env.localHeader
  console.log('Headers after changing it to mock-echo for local dev in GET groups', permittedHeaders)
  // Given a specific Concept Id return the page for that group
  const requestConfiguration = {
    headers: permittedHeaders,
    method: 'GET',
    url: `${process.env.cmrRootUrlTest}/groups/${groupConceptId}`
  }
  // Interceptors require an instance of axios
  const instance = axios.create()
  const { interceptors } = instance
  const {
    request: requestInterceptor,
    response: responseInterceptor
  } = interceptors
  // return response
  return instance.request(requestConfiguration)
}
