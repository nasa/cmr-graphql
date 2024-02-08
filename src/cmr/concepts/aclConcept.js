import snakeCaseKeys from 'snakecase-keys'
import { pick, snakeCase } from 'lodash'
import { aclQuery } from '../../utils/aclQuery'
import { mergeParams } from '../../utils/mergeParams'
import { downcaseKeys } from '../../utils/downcaseKeys'
import Concept from './concept'

export default class AclConcept extends Concept {
  /**
   * Instantiates an AclConcept object
   * @param {String} conceptType The CMR concept type to query against
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(conceptType, headers = {}, requestInfo = {}, params = {}) {
    super(conceptType, headers, requestInfo, params)

    // Set properties for data available during instantiation
    this.conceptType = conceptType
    this.headers = headers
    this.requestInfo = requestInfo

    // Defaults the result set to an empty object
    this.items = {}

    this.params = params
  }

  fetch(searchParams) {
    const params = mergeParams(searchParams)

    // Default an array to hold the promises we need to make depending on the requested fields
    const promises = []

    const { jsonKeys } = this.requestInfo

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
   * Query the CMR JSON API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchAcl(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'json')

    // Construct the promise that will request data from the json endpoint
    return aclQuery({
      conceptType: this.getConceptType(),
      params: pick(snakeCaseKeys(searchParams), this.getPermittedJsonSearchParams()),
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: providedHeaders
    })
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
   * Get the total number of records available for a given search across all endpoints. Also
   * ensure that the value is the same if a given search spans multiple endpoints
   */
  getItemCount() {
    const { jsonKeys = [] } = this.requestInfo

    if (jsonKeys.length) {
      // Only json keys were requested, return the json item count
      return this.jsonItemCount
    }

    return 0
  }
}
