import { pick } from 'lodash'
import snakecaseKeys from 'snakecase-keys'
import { mergeParams } from '../../utils/mergeParams'
import { tagQuery } from '../../utils/tagQuery'
import Concept from './concept'

export default class Tag extends Concept {
  /**
   * Instantiates an ACL object from the CMR API
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('tags', headers, requestInfo, params)
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

  fetch(searchParams) {
    const params = mergeParams(searchParams)

    // Default an array to hold the promises we need to make depending on the requested fields
    const promises = []

    const { jsonKeys } = this.requestInfo

    const jsonHeaders = {
      ...this.headers
    }
    promises.push(
      this.fetchTag(params, jsonKeys, jsonHeaders)
    )

    this.response = Promise.all(promises)
  }

  /**
   * Query the CMR JSON API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchTag(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'json')

    // Construct the promise that will request data from the json endpoint
    return tagQuery({
      conceptType: this.getConceptType(),
      params: pick(snakecaseKeys(searchParams), this.getPermittedJsonSearchParams()),
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: providedHeaders
    })
  }
}
