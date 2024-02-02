import snakeCaseKeys from 'snakecase-keys'

import { pick, snakeCase } from 'lodash'

import { CONCEPT_TYPES } from '../../constants'

import { aclQuery } from '../../utils/aclQuery'
import { mergeParams } from '../../utils/mergeParams'
import { parseError } from '../../utils/parseError'
import { downcaseKeys } from '../../utils/downcaseKeys'

export default class AclConcept {
  /**
   * Instantiates a Concept object
   * @param {String} conceptType The CMR concept type to query against
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(conceptType, headers = {}, requestInfo = {}, params = {}) {
    // Set properties for data available during instantiation
    this.conceptType = conceptType
    this.headers = headers
    this.requestInfo = requestInfo

    // Defaults the result set to an empty object
    this.items = {}

    this.params = params
    console.log('@@acl concept params', params)
  }

  fetch(searchParams) {
    const params = mergeParams(searchParams)

    console.log('🚀 fetch acl params', params)

    // Default an array to hold the promises we need to make depending on the requested fields
    const promises = []

    const {
      jsonKeys
    } = this.requestInfo

    // If (jsonKeys.length) {
    if (jsonKeys.length > 0) {
      const jsonHeaders = {
        ...this.headers
      }
      promises.push(
        this.fetchAcl(params, jsonKeys, jsonHeaders)
      )
    } else {
      // Push a null promise to the array so that the umm promise always exists as
      // the second element of the promise array
      promises.push(
        // eslint-disable-next-line no-promise-executor-return
        new Promise((resolve) => resolve(null))
      )
    }

    this.response = Promise.all(promises)
  }

  /**
   * Log requested keys for metrics and debugging
   * @param {Array} keys List of keys being requested
   * @param {String} format Format of the request (json, umm, meta)
   */
  logKeyRequest(keys, format) {
    // Prevent logging concept types, their meta keys are logged above
    const filteredKeys = keys.filter((field) => CONCEPT_TYPES.indexOf(field) === -1)

    filteredKeys.forEach((key) => {
      console.log(`Request ${this.getRequestId()} from ${this.getClientId()} to [concept: ${this.getConceptType()}] requested [format: ${format}, key: ${key}]`)
    })
  }

  /**
   * Query the CMR JSON API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchAcl(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'json')
    console.log('blabla', requestedKeys)

    console.log('snakeCaseKeys(searchParams)', snakeCaseKeys(searchParams))

    console.log('snakeCaseKeys(searchParams)', pick(snakeCaseKeys(searchParams), this.getPermittedJsonSearchParams()))

    // Construct the promise that will request data from the json endpoint
    return aclQuery({
      conceptType: this.getConceptType(),
      params: pick(snakeCaseKeys(searchParams), this.getPermittedJsonSearchParams()),
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: providedHeaders
    })
  }

  /**
   * Return the response from the query to CMR
   */
  async getResponse() {
    return this.response
  }

  /**
   * Set the total number of records available for a given search to the json endpoint
   * @param {Integer} itemCount The total number of records available for a given search
   */
  setJsonItemCount(itemCount) {
    this.jsonItemCount = parseInt(itemCount, 10)
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
   * Rename fields, add fields, modify fields, etc
   * @param {Object} item The item returned from the CMR json endpoint
   */
  normalizeJsonItem(item) {
    return item
  }

  /**
   * Set the search after identifier for a search against against the json endpoint
   * @param {Float} searchAfterIdentifier The search after identifier provided by CMR
   */
  setJsonSearchAfter(searchAfterIdentifier) {
    this.jsonSearchAfterIdentifier = searchAfterIdentifier
  }

  /**
   * Retrieve the request id header from the request
   * @param {Object} headers The provided headers from the query
   * @return {String} Request ID defined in the headers
   */
  getRequestId() {
    const {
      'CMR-Request-Id': requestId
    } = this.headers

    return requestId
  }

  /**
   * Retrieve the client id header from the request
   * @param {Object} headers The provided headers from the query
   * @return {String} Client ID defined in the headers
   */
  getClientId() {
    const {
      'Client-Id': clientId
    } = this.headers

    return clientId
  }

  /**
   * Get the CMR concept type of this object
   */
  getConceptType() {
    return this.conceptType
  }

  /**
   * Returns an array of keys that should not be indexed when sent to CMR
   */
  getNonIndexedKeys() {
    return [
      'concept_id',
      'offset',
      'page_size',
      'sort_key',
      'permitted_user',
      'include_full_acl',
      'page_num',
      'target'
    ]
  }

  /**
   * Retrieve a single item from the result set
   * @param {String} id The concept id of an item to lookup in the result set
   */
  getItem(id) {
    // If an item with the provided id does not exist, create one
    if (Object.keys(this.items).indexOf(id) === -1) {
      this.items[id] = {}
    }

    // Fetch the item from the result set
    const { [id]: item } = this.items

    return item
  }

  /**
   * Set a specific property on an object within the result set of a search operation
   * @param {String} id Concept ID to set a value for within the result set
   * @param {String} key The key to set within the result
   * @param {Any} value They value to assign to the key within the result
   */
  setItemValue(id, key, value) {
    // Ensure that our object knows about the item by creating it if it doesn't exist
    this.getItem(id)

    // Set the value
    this.items[id][key] = value
  }

  /**
   * Parses the response from the json endpoint
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   * @param {Array} jsonKeys Array of the keys requested in the query
   */
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

      const { concept_id: conceptId } = normalizedItem

      jsonKeys.forEach((jsonKey) => {
        const cmrKey = snakeCase(jsonKey)

        const { [cmrKey]: keyValue } = normalizedItem

        // Snake case the key requested and any children of that key
        this.setItemValue(conceptId, jsonKey, keyValue)
      })
    })
  }

  /**
   * Return the raw result set
   */
  getItems() {
    return this.items
  }

  /**
   * Get the total number of records available for a given search across all endpoints. Also
   * ensure that the value is the same if a given search spans multiple endpoints
   */
  getItemCount() {
    const { jsonKeys = [] } = this.requestInfo

    if (jsonKeys.length) {
      console.log('@@@ jsonKeys.length', jsonKeys.length)

      // Only json keys were requested, return the json item count
      console.log('@@@ this.jsonItemCount', this.jsonItemCount)

      return this.jsonItemCount
    }

    return 0
  }

  /**
   * Encode and return a base64 hashed version of the json and umm search after identifier
   */
  encodeCursor() {
    if (this.jsonSearchAfterIdentifier || this.ummSearchAfterIdentifier) {
      return Buffer.from(
        JSON.stringify({
          json: this.jsonSearchAfterIdentifier,
          umm: this.ummSearchAfterIdentifier
        })
      ).toString('base64')
    }

    return null
  }

  getFormattedResponse() {
    // Determine if the query was a list or not, list queries return meta
    // keys using a slightly different format
    const {
      isList
    } = this.requestInfo

    // Retrieve the result set regardless of whether or not the query is a list or not
    const items = this.getItems()

    if (isList) {
      const count = this.getItemCount()
      const cursor = this.encodeCursor()

      return {
        count,
        cursor,
        items: Object.values(items)
      }
    }

    return Object.values(items)
  }

  /**
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      'concept_id',
      'offset',
      'page_size',
      'sort_key',
      'permitted_user',
      'include_full_acl',
      'page_num',
      'target'
    ]
  }

  /**
   * Parses the response from each endpoint after a request is made
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   */
  async parse(requestInfo) {
    try {
      const {
        jsonKeys
      } = requestInfo

      const response = await this.getResponse()

      const [jsonResponse] = response
      await this.parseJson(jsonResponse, jsonKeys)
    } catch (e) {
      parseError(e, { reThrowError: true })
    }
  }
}
