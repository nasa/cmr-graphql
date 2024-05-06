import pick from 'lodash/pick'
import snakecaseKeys from 'snakecase-keys'

import { mergeParams } from '../../utils/mergeParams'
import { tagDefinitionQuery } from '../../utils/tagDefinitionQuery'

import Concept from './concept'

export default class TagDefinition extends Concept {
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
      this.fetchTagDefinition(params, jsonKeys, jsonHeaders)
    )

    this.response = Promise.all(promises)
  }

  /**
   * Query the CMR JSON API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchTagDefinition(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'json')

    // Construct the promise that will request data from the json endpoint
    return tagDefinitionQuery({
      conceptType: this.getConceptType(),
      params: pick(snakecaseKeys(searchParams), this.getPermittedJsonSearchParams()),
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: providedHeaders
    })
  }
}
