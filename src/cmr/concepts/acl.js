import AclConcept from './aclConcept'

export default class Acl extends AclConcept {
  /**
   * Instantiates an Acl object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  // first fetchAcl function --> providedHeaders for now
  // in here calls aclQuery save where cmrQuery saved--> similar to cmrQuery

  constructor(headers, requestInfo, params) {
    super('acls', headers, requestInfo, params)
  
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
   * @param {Object} headers Headers requested by the query
   */
  fetchAcl(searchParams, ummKeys, headers) {
    return super.fetchAcl(searchParams, ummKeys, headers)
  }
}
