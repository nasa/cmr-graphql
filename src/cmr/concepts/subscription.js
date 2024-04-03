import { v4 as uuidv4 } from 'uuid'
import camelcaseKeys from 'camelcase-keys'
import { uniq } from 'lodash'
import { mergeParams } from '../../utils/mergeParams'

import Concept from './concept'

export default class Subscription extends Concept {
  /**
   * Instantiates a Subscription object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('subscriptions', headers, requestInfo, params)

    this.metadataSpecification = {
      URL: `https://cdn.earthdata.nasa.gov/umm/subscription/v${process.env.ummSubscriptionVersion}`,
      Name: 'UMM-Sub',
      Version: process.env.ummSubscriptionVersion
    }
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
      'subscriber_id',
      'type'
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
      'subscriber_id',
      'type'
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
   * @param {Array} ummKeys Keys requested by the query
   * @param {Object} headers Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    const ummHeaders = {
      ...headers,
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummSubscriptionVersion}`
    }

    return super.fetchUmm(searchParams, ummKeys, ummHeaders)
  }

  /**
   * Ingest the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  ingest(data, requestedKeys, providedHeaders) {
    const params = mergeParams(data)

    // Default headers
    const headers = {
      ...providedHeaders,
      Accept: 'application/json',
      'Content-Type': `application/vnd.nasa.cmr.umm+json; version=${process.env.ummSubscriptionVersion}`
    }

    // Add MetadataSpecification to the data
    // eslint-disable-next-line no-param-reassign
    params.metadataSpecification = this.metadataSpecification

    const casedKeys = camelcaseKeys(params, {
      pascalCase: true,
      exclude: ['nativeId']
    })

    // Use the provided native id and provider id
    const { nativeId = uuidv4() } = params

    super.ingest(casedKeys, requestedKeys, headers, { queryPath: `ingest/subscriptions/${nativeId}` })
  }

  /**
   * Delete the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  delete(data, requestedKeys, providedHeaders) {
    const params = mergeParams(data)

    this.logKeyRequest(requestedKeys, 'ingest')

    const { nativeId } = params

    super.delete(data, requestedKeys, providedHeaders, { queryPath: `ingest/subscriptions/${nativeId}` })
  }
}
