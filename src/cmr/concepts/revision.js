import {
  snakeCase,
  kebabCase,
  _
} from 'lodash'
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

  /**
   * Parses the response from the umm endpoint
   * @param {Object} ummResponse HTTP response from the CMR endpoint
   * @param {Array} ummKeys Array of the keys requested in the query
   */
  async parseUmm(ummResponse, ummKeys) {
    // Pull out the key mappings so we can retrieve the values below
    const { headers } = ummResponse
    const {
      'cmr-hits': cmrHits,
      'cmr-search-after': ummSearchAfterIdentifier
    } = downcaseKeys(headers)

    this.setUmmItemCount(cmrHits)

    this.setUmmSearchAfter(ummSearchAfterIdentifier)

    const items = this.parseUmmBody(ummResponse)

    items.forEach((item) => {
      const normalizedItem = this.normalizeUmmItem(item)

      const { meta, umm } = normalizedItem

      const { 'revision-id': revisionId } = meta

      // Loop through the requested umm keys and adjust for correct casing
      ummKeys.forEach((ummKey) => {
        const metaKey = kebabCase(ummKey)
        const subUmmKey = _.startCase(ummKey).replace(/\s/g, '')

        const { [metaKey]: metaKeyValue } = meta
        const { [subUmmKey]: subUmmKeyValue } = umm

        // Snake case the key requested and any children of that key
        this.setItemValue(`Revision${revisionId}`, ummKey, (metaKeyValue || subUmmKeyValue))
      })
    })
  }

  /**
   * Parses the response from the json endpoint, utlized when user requests only meta keys
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   * @param {Array} jsonKeys Array of the keys requested in the query
   */
  async parseJson(jsonResponse, jsonKeys) {
    // Pull out the key mappings so we can retrieve the values below
    const { headers } = jsonResponse
    const {
      'cmr-hits': cmrHits,
      'cmr-search-after': jsonSearchAfterIdentifier
    } = downcaseKeys(headers)

    this.setJsonItemCount(cmrHits)

    this.setJsonSearchAfter(jsonSearchAfterIdentifier)

    const items = this.parseJsonBody(jsonResponse)

    // Loop through the requested json keys and adjust for correct casing
    items.forEach((item) => {
      const normalizedItem = this.normalizeJsonItem(item)

      const { revision_id: revisionId } = normalizedItem

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
}
