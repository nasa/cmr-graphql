import camelcaseKeys from 'camelcase-keys'
import { snakeCase } from 'lodash'
import Concept from './concept'
import { downcaseKeys } from '../../utils/downcaseKeys'

export default class Variable extends Concept {
  /**
   * Instantiates a Variable object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('variables', headers, requestInfo, params)

    const { providerId } = params

    this.ingestPath = `providers/${providerId}/variables`
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
      this.setEssentialJsonValues(conceptId, normalizedItem)

      jsonKeys.forEach((jsonKey) => {
        // Snake case the key requested and any children of that key
        const cmrKey = snakeCase(jsonKey)

        const { [cmrKey]: keyValue } = normalizedItem

        let formattedKeyValue = keyValue

        // Once accessed, ensure that the child key/value pairs are consistently returning in `camelCase`
        // Note applying camelcase logic to all keys in `concepts` will not work because of `tags` business logic
        if (jsonKey === 'scienceKeywords' || jsonKey === 'instanceInformation') {
          formattedKeyValue = camelcaseKeys(keyValue, { deep: true })
        }

        this.setItemValue(conceptId, jsonKey, formattedKeyValue)
      })
    })
  }

  /**
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} ummKeys Keys requested by the query
   * @param {Object} headers Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    const ummHeaders = {
      ...headers,
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummVariableVersion}`
    }

    return super.fetchUmm(searchParams, ummKeys, ummHeaders)
  }
}
