// import camelcaseKeys from 'camelcase-keys'
import Concept from './concept'

export default class OrderOption extends Concept {
  /**
   * Instantiates an OrderOption object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    // This concept uses the "-" character to delineate spaces in CMR we must pass it
    // in this form to fetch order option concepts from CMR
    super('order-options', headers, requestInfo, params)
  }

  // /**
  //  * Set a value in the result set that a query has not requested but is necessary for other functionality
  //  * @param {String} id Concept ID to set a value for within the result set
  //  * @param {Object} item The item returned from the CMR json endpoint
  //  */
  // setEssentialJsonValues(id, item) {
  //   super.setEssentialJsonValues(id, item)

  //   const { association_details: associationDetails } = item

  //   const formattedAssociationDetails = camelcaseKeys(associationDetails, { deep: true })

  //   // Associations on services are used to retrieve order-options
  //   if (associationDetails) {
  //     this.setItemValue(id, 'associationDetails', formattedAssociationDetails)
  //   }
  // }

  // /**
  //      * Set a value in the result set that a query has not requested but is necessary for other functionality
  //      * @param {String} id Concept ID to set a value for within the result set
  //      * @param {Object} item The item returned from the CMR json endpoint
  //      */
  // setEssentialUmmValues(id, item) {
  //   super.setEssentialUmmValues(id, item)

  //   const { meta } = item
  //   const { 'association-details': associationDetails } = meta

  //   const formattedAssociationDetails = camelcaseKeys(associationDetails, { deep: true })

  //   //  Associations on services are used to retrieve order-options
  //   if (associationDetails) {
  //     this.setItemValue(id, 'associationDetails', formattedAssociationDetails)
  //   }
  // }

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
      Accept: 'application/vnd.nasa.cmr.umm_results+json'
    }
    const ummResponse = super.fetchUmm(searchParams, ummKeys, ummHeaders)
    return ummResponse
  }
}
