import { snakeCase } from 'lodash'
import { downcaseKeys } from '../../utils/downcaseKeys'
import Concept from './concept'

export default class Revision extends Concept {
  /**
   * Instantiates an Revision object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */

  // eslint-disable-next-line no-useless-constructor
  constructor(conceptType, headers, requestInfo, params) {
    // This concept uses the "-" character to delineate spaces in CMR we must pass it
    // in this form to fetch order option concepts from CMR

    super(conceptType, headers, requestInfo, params)
  }

  async parseJson(jsonResponse, jsonKeys) {
    const { headers } = jsonResponse
    const {
      'cmr-hits': cmrHits,
      'cmr-search-after': jsonSearchAfterIdentifier
    } = downcaseKeys(headers)

    this.setJsonItemCount(cmrHits)

    this.setJsonSearchAfter(jsonSearchAfterIdentifier)

    const items = this.parseJsonBody(jsonResponse)

    items.forEach((item) => {
      const normalizedItem = this.normalizeJsonItem(item)

      const { revision_id: revisionId } = normalizedItem

      this.setEssentialJsonValues(revisionId, normalizedItem)

      jsonKeys.forEach((jsonKey) => {
        const cmrKey = snakeCase(jsonKey)

        const { [cmrKey]: keyValue } = normalizedItem

        // Snake case the key requested and any children of that key
        this.setItemValue(`Revision${revisionId}`, jsonKey, keyValue)
      })
    })
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
    // TODO: When generics support versioning we need to update this concept
    const ummHeaders = {
      ...headers,
      Accept: 'application/vnd.nasa.cmr.umm_results+json'
    }
    const ummResponse = super.fetchUmm(searchParams, ummKeys, ummHeaders)

    return ummResponse
  }
}
