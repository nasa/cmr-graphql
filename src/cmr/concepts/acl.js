import aclConcept from './aclConcept'

export default class Acl extends aclConcept {
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

    this.facets = []
  }

  // Call fetchAcl

  // parseJsonBody()
}
