import pick from 'lodash/pick'

import snakecaseKeys from 'snakecase-keys'

import { accessControlRequest } from '../../utils/accessControlRequest'

import Concept from './concept'
import { mergeParams } from '../../utils/mergeParams'

export default class Permission extends Concept {
  /**
   * Instantiates an ACL object from the CMR API
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('permissions', headers, requestInfo, params)
  }

  /**
   * Parse and return the array of data from the nested response body
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   * @returns {Array} An array of key/value [{key: KEY, value: VALUE}]
   */
  parseJsonBody(jsonResponse) {
    const { data } = jsonResponse

    // The permissions endpoint returns an object, our code expects
    // an array to be able to process each item
    return Object.entries(data).map(([key, value]) => ({
      key,
      value
    }))
  }

  /**
   * Creates unique item keys regardless of whether or not a user calls for data with similar conceptIds (as is the case with revisions)
   * @param {Int} itemIndex This method is called in a loop, this is the index of the loop
   * @param {Object} normalizedItem The item to generate a key for, after it's been through our normalization method
   * @returns A unique key representing this item
   */
  generateJsonItemKey(itemIndex, normalizedItem) {
    return btoa(JSON.stringify(normalizedItem))
  }

  /**
   * Query the CMR JSON API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchJson(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'json')

    // Construct the promise that will get the records from CMR
    return accessControlRequest({
      headers: providedHeaders,
      method: 'GET',
      nonIndexedKeys: this.getNonIndexedKeys(),
      params: pick(snakecaseKeys(searchParams), this.getPermittedJsonSearchParams()),
      path: 'permissions'
    })
  }

  /**
   * Rename fields, add fields, modify fields, etc
   * @param {Object} item The item returned from the CMR json endpoint
   */
  normalizeJsonItem(item) {
    const {
      conceptId,
      conceptIds,
      provider,
      systemObject,
      target
    } = mergeParams(this.params)

    const { key, value } = item

    const returnItem = {
      permissions: value
    }

    if (conceptId || conceptIds) {
      returnItem.concept_id = key
    }

    if (systemObject) {
      returnItem.system_object = key
    }

    if (target && provider) {
      returnItem.target = key
    }

    return returnItem
  }

  /**
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      'concept_id',
      'page_size',
      'provider',
      'system_object',
      'target_group_id',
      'target',
      'user_id',
      'user_type'
    ]
  }
}
