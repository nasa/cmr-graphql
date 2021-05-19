import { uniq } from 'lodash'
import Concept from './concept'

export default class Subscription extends Concept {
  /**
   * Instantiates a Subscription object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   */
  constructor(headers, requestInfo) {
    super('subscriptions', headers, requestInfo)
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
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      ...super.getPermittedJsonSearchParams(),
      'collection_concept_id',
      'provider',
      'subscriber_id'
    ]
  }

  /**
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      ...super.getPermittedUmmSearchParams(),
      'collection_concept_id',
      'provider',
      'subscriber_id'
    ]
  }

  /**
   * Returns an array of keys that should not be indexed when sent to CMR
   */
  getNonIndexedKeys() {
    return uniq([
      ...super.getNonIndexedKeys(),
      'collection_concept_id'
    ])
  }

  /**
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    const ummHeaders = {
      ...headers,
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummSubscriptionVersion}`
    }

    return super.fetchUmm(searchParams, ummKeys, ummHeaders)
  }

  /**
   * Rename fields, add fields, modify fields, etc
   * @param {Object} item The item returned from the CMR json endpoint
   */
  normalizeJsonItem(item) {
    // Substitute hyphens for underscores for consistency
    const {
      'collection-concept-id': collectionConceptId,
      'subscriber-id': subscriberId
    } = item

    // eslint-disable-next-line no-param-reassign
    delete item['collection-concept-id']

    // eslint-disable-next-line no-param-reassign
    item.collection_concept_id = collectionConceptId

    // eslint-disable-next-line no-param-reassign
    delete item['subscriber-id']

    // eslint-disable-next-line no-param-reassign
    item.subscriber_id = subscriberId

    return item
  }
}
