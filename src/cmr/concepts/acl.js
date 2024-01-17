import Concept from './concept'

export default class Acl extends Concept {
  /**
   * Instantiates an Acl object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('acl', headers, requestInfo, params)
  }

  /**
   * Parse and return the array of data from the nested response body
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   */

  parseJsonBody(jsonResponse) {
    const { data } = jsonResponse

    const { items } = data

    return items
  }

  /**
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} ummKeys Keys requested by the query
   * @param {Object} ummKeys Headers requested by the query
   */
  fetch(searchParams, ummKeys, headers) {
    // TODO: When generics support versioning we need to update this concept
    const ummHeaders = {
      ...headers,
      Accept: 'application/vnd.nasa.cmr.umm_results+json'
    }
    const ummResponse = super.fetchUmm(searchParams, ummKeys, ummHeaders)

    return ummResponse
  }
}