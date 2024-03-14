import snakecaseKeys from 'snakecase-keys'
import { kebabCase, pick } from 'lodash'
import { mergeParams } from '../../utils/mergeParams'
import { providersQuery } from '../../utils/providersQuery'
import Concept from './concept'

export default class Provider extends Concept {
  /**
   * Instantiates a Provider object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('providers', headers, requestInfo, params)
  }

  /**
   * Parses the response from the json endpoint
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   * @param {Array} jsonKeys Array of the keys requested in the query
   */
  async parseJson(jsonResponse, jsonKeys) {
    this.setJsonItemCount(jsonResponse.data.length)

    const items = this.parseJsonBody(jsonResponse)
    items.forEach((item) => {
      const normalizedItem = this.normalizeJsonItem(item)
      const { 'provider-id': providerId } = normalizedItem
      this.setEssentialJsonValues(providerId, normalizedItem)

      jsonKeys.forEach((jsonKey) => {
        const cmrKey = kebabCase(jsonKey)
        const { [cmrKey]: keyValue } = normalizedItem
        // Snake case the key requested and any children of that key
        this.setItemValue(providerId, jsonKey, keyValue)
      })
    })
  }

  /**
   * Parse and return the array of data from the nested response body
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   */
  parseJsonBody(jsonResponse) {
    const { data } = jsonResponse

    return data
  }

  fetch(searchParams) {
    const params = mergeParams(searchParams)

    // Default an array to hold the promises we need to make depending on the requested fields
    const promises = []

    const { jsonKeys } = this.requestInfo

    const jsonHeaders = {
      ...this.headers
    }
    promises.push(
      this.fetchProviders(params, jsonKeys, jsonHeaders)
    )

    this.response = Promise.all(promises)
  }

  /**
   * Query the CMR JSON API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchProviders(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'json')

    // Construct the promise that will request data from the json endpoint
    return providersQuery({
      conceptType: this.getConceptType(),
      params: pick(snakecaseKeys(searchParams), this.getPermittedJsonSearchParams()),
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: providedHeaders
    })
  }
}
