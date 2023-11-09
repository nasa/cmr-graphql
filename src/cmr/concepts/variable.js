import camelcaseKeys from 'camelcase-keys'

import Concept from './concept'

export default class Variable extends Concept {
  /**
   * Instantiates a Variable object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   * @param {String} parentCollectionConceptId Optional collection-id passed for some child queries of search
   */
  constructor(headers, requestInfo, params, parentCollectionConceptId) {
    super('variables', headers, requestInfo, params)
    this.parentCollectionConceptId = parentCollectionConceptId

    const { providerId } = params

    this.ingestPath = `providers/${providerId}/variables`
  }

  /**
   * Set a value in the result set that a query has not requested but is necessary for other functionality
   * @param {String} id Concept ID to set a value for within the result set
   * @param {Object} item The item returned from the CMR json endpoint
   */
  setEssentialJsonValues(id, item) {
    super.setEssentialJsonValues(id, item)

    // Add the parent collection concept-id and pass it to the child queries from this variable
    if (this.parentCollectionConceptId) {
      this.setItemValue(id, 'parentCollectionConceptId', this.parentCollectionConceptId)
    }
  }

  /**
     * Set a value in the result set that a query has not requested but is necessary for other functionality
     * @param {String} id Concept ID to set a value for within the result set
     * @param {Object} item The item returned from the CMR json endpoint
     */
  setEssentialUmmValues(id, item) {
    super.setEssentialUmmValues(id, item)

    const { meta } = item
    const { 'association-details': associationDetails } = meta

    const formattedAssociationDetails = camelcaseKeys(associationDetails, { deep: true })

    //  Associations on variables are used to retrieve order-options
    if (associationDetails) {
      this.setItemValue(id, 'associationDetails', formattedAssociationDetails)
    }

    // Add the parent collection concept-id and pass it to the child queries from this variable
    if (this.parentCollectionConceptId) {
      this.setItemValue(id, 'parentCollectionConceptId', this.parentCollectionConceptId)
    }
  }

  /**
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      ...super.getPermittedJsonSearchParams(),
      'type'
    ]
  }

  /**
     * Returns an array of keys representing supported search params for the umm endpoint
     */
  getPermittedUmmSearchParams() {
    return [
      ...super.getPermittedUmmSearchParams(),
      'type'
    ]
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
  fetchUmm(searchParams, ummKeys, headers) {
    const ummHeaders = {
      ...headers,
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummVariableVersion}`
    }

    return super.fetchUmm(searchParams, ummKeys, ummHeaders)
  }
}
