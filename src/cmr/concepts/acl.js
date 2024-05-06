import pick from 'lodash/pick'
import snakeCase from 'lodash/snakeCase'
import snakecaseKeys from 'snakecase-keys'
import uniq from 'lodash/uniq'

import { accessControlRequest } from '../../utils/accessControlRequest'
import { mergeParams } from '../../utils/mergeParams'

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
   * Returns an array of keys that should not be indexed when sent to CMR
   */
  getNonIndexedKeys() {
    return uniq([
      ...super.getNonIndexedKeys(),
      'permitted_group'
    ])
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
   * Query the CMR JSON API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  fetchJson(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'json')

    const defaultSearchParams = {
      include_full_acl: true
    }

    const { conceptId } = searchParams

    if (conceptId) {
      // eslint-disable-next-line no-param-reassign
      searchParams.id = conceptId

      // eslint-disable-next-line no-param-reassign
      delete searchParams.conceptId
    }

    // Construct the promise that will get the records from CMR
    return accessControlRequest({
      headers: providedHeaders,
      method: 'GET',
      nonIndexedKeys: this.getNonIndexedKeys(),
      params: pick(snakecaseKeys({
        ...searchParams,
        ...defaultSearchParams
      }), this.getPermittedJsonSearchParams()),
      path: 'acls'
    })
  }

  /**
   * Rename fields, add fields, modify fields, etc
   * @param {Object} item The item returned from the CMR json endpoint
   */
  normalizeJsonItem(item) {
    // Alias conceptId for consistency in responses
    const {
      acl = {}
    } = item

    const {
      catalog_item_identity: catalogItemIdentity,
      group_permissions: groupPermissions,
      legacy_guid: legacyGuid,
      provider_identity: providerIdentity,
      system_identity: systemIdentity
    } = acl

    return {
      ...item,
      group_permissions: groupPermissions,
      catalog_item_identity: catalogItemIdentity,
      legacy_guid: legacyGuid,
      provider_identity: providerIdentity,
      system_identity: systemIdentity
    }
  }

  /**
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      'concept_id',
      'group_permission',
      'identity_type',
      'id',
      'include_full_acl',
      'page_size',
      'permitted_concept_id',
      'permitted_group',
      'permitted_user',
      'permitted_user',
      'provider',
      'target_id',
      'target'
    ]
  }

  /**
   * Parse and return the body of an ingest operation
   * @param {Object} ingestResponse HTTP response from the CMR endpoint
   */
  parseIngestBody(ingestResponse, ingestKeys) {
    const { data } = ingestResponse

    ingestKeys.forEach((key) => {
      const cmrKey = snakeCase(key)

      const { [cmrKey]: keyValue } = data

      this.setIngestValue(key, keyValue)
    })
  }

  /**
   * Ingest the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  create(data, requestedKeys, providedHeaders) {
    const params = mergeParams(data)

    this.logKeyRequest(requestedKeys, 'ingest')

    // Construct the promise that will create the record in CMR
    this.response = accessControlRequest({
      headers: providedHeaders,
      method: 'POST',
      params,
      path: 'acls'
    })
  }

  /**
   * Ingest the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  update(data, requestedKeys, providedHeaders) {
    const params = mergeParams(data)

    this.logKeyRequest(requestedKeys, 'ingest')

    const { conceptId } = params

    delete params.conceptId

    // Construct the promise that will update the data in CMR
    this.response = accessControlRequest({
      headers: providedHeaders,
      method: 'PUT',
      params,
      path: `acls/${conceptId}`
    })
  }

  /**
   * Ingest the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  delete(data, requestedKeys, providedHeaders) {
    const params = mergeParams(data)

    this.logKeyRequest(requestedKeys, 'ingest')

    const { conceptId } = params

    delete params.conceptId

    // Construct the promise that will delete the record from CMR
    this.response = accessControlRequest({
      headers: providedHeaders,
      method: 'DELETE',
      path: `acls/${conceptId}`
    })
  }
}
