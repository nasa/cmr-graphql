import camelcaseKeys from 'camelcase-keys'

import Concept from './concept'

export default class Service extends Concept {
  /**
   * Instantiates a Service object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params, parentCollectionConceptId) {
    super('services', headers, requestInfo, params)
    this.parentCollectionConceptId = parentCollectionConceptId
  }

  /**
   * Set a value in the result set that a query has not requested but is necessary for other functionality
   * @param {String} id Concept ID to set a value for within the result set
   * @param {Object} item The item returned from the CMR json endpoint
   */
  setEssentialJsonValues(id, item) {
    super.setEssentialJsonValues(id, item)

    const { association_details: associationDetails } = item

    const formattedAssociationDetails = camelcaseKeys(associationDetails, { deep: true })

    // Associations on services are used to retrieve order-options
    if (associationDetails) {
      this.setItemValue(id, 'associationDetails', formattedAssociationDetails)
    }
    // Add the parent collection concept-id and pass it to the child queries from this service
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

    //  Associations on services are used to retrieve order-options
    if (associationDetails) {
      this.setItemValue(id, 'associationDetails', formattedAssociationDetails)
    }

    // Add the parent collection concept-id and pass it to the child queries from this service
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
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    const ummHeaders = {
      ...headers,
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummServiceVersion}`
    }

    return super.fetchUmm(searchParams, ummKeys, ummHeaders)
  }
}
