import snakeCaseKeys from 'snakecase-keys'
import { pick } from 'lodash'
import { aclQuery } from '../../utils/aclQuery'
import { mergeParams } from '../../utils/mergeParams'
import { downcaseKeys } from '../../utils/downcaseKeys'
import Concept from './concept'

export default class Acl extends Concept {
  /**
   * Instantiates an ACL object from the CMR API
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('acls', headers, requestInfo, params)
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
}
