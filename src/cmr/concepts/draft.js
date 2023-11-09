import { pick, uniq } from 'lodash'

import { pickIgnoringCase } from '../../utils/pickIgnoringCase'
import { mergeParams } from '../../utils/mergeParams'
import { cmrIngest } from '../../utils/cmrIngest'

import Concept from './concept'

export default class Draft extends Concept {
  /**
   * Instantiates a Draft object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(conceptType, headers, requestInfo, params) {
    super(conceptType, headers, requestInfo, params)

    const {
      draftConceptId,
      providerId
    } = params

    this.ingestPath = `providers/${providerId}/${conceptType}`
    this.publishPath = `publish/${draftConceptId}`

    const {
      ummCollectionVersion,
      ummServiceVersion,
      ummToolVersion,
      ummVariableVersion
    } = process.env

    let ummType
    let ummName
    let ummVersion
    switch (conceptType) {
      case 'collection-drafts':
        ummName = 'UMM-C'
        ummType = 'collection'
        ummVersion = ummCollectionVersion
        break

      case 'service-drafts':
        ummName = 'UMM-S'
        ummType = 'service'
        ummVersion = ummServiceVersion
        break

      case 'tool-drafts':
        ummName = 'UMM-T'
        ummType = 'tool'
        ummVersion = ummToolVersion
        break

      case 'variable-drafts':
        ummName = 'UMM-Var'
        ummType = 'variable'
        ummVersion = ummVariableVersion
        break

      default:
        break
    }

    // This needs to be the published version number, not draft version,
    // so that when a user tries to publish the draft, it has the correct MetadataSpecification
    this.metadataSpecification = {
      URL: `https://cdn.earthdata.nasa.gov/umm/${ummType}/v${ummVersion}`,
      Name: ummName,
      Version: ummVersion
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
      'name',
      'native_id',
      'options',
      'provider'
    ]
  }

  /**
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      ...super.getPermittedUmmSearchParams(),
      'name',
      'native_id',
      'options',
      'provider'
    ]
  }

  /**
   * Returns an array of keys that should not be indexed when sent to CMR
   */
  getNonIndexedKeys() {
    return uniq([
      ...super.getNonIndexedKeys(),
      'name',
      'native_id',
      'provider'
    ])
  }

  getPermittedPublishKeys() {
    return [
      'nativeId',
      'collectionConceptId'
    ]
  }

  /**
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} ummKeys Keys requested by the query
   * @param {Object} headers Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    const { ummVersion } = searchParams

    let acceptVersion
    if (ummVersion) {
      acceptVersion = `version=${ummVersion}`
    }

    const ummHeaders = {
      ...headers,
      Accept: `application/vnd.nasa.cmr.umm_results+json; ${acceptVersion}`
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
    const { ummVersion } = data

    if (!ummVersion) {
      throw new Error('`ummVersion` is required when ingesting drafts.')
    }

    // Default headers
    const defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': `application/vnd.nasa.cmr.umm+json; version=${ummVersion}`
    }

    // Merge default headers into the provided headers and then pick out only permitted values
    const permittedHeaders = pickIgnoringCase({
      ...defaultHeaders,
      ...providedHeaders
    }, [
      'Accept',
      'Authorization',
      'Client-Id',
      'Content-Type',
      'CMR-Request-Id'
    ])

    const metadata = {
      MetadataSpecification: this.metadataSpecification,
      nativeId: data.nativeId,
      ...data.metadata
    }

    super.ingest(
      metadata,
      requestedKeys,
      permittedHeaders
    )
  }

  publish(data, requestedKeys, providedHeaders) {
    const { ummVersion } = data

    const params = mergeParams(data)

    // Default headers
    const defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': `application/vnd.nasa.cmr.umm+json; version=${ummVersion}`
    }

    // Merge default headers into the provided headers and then pick out only permitted values
    const permittedHeaders = pickIgnoringCase({
      ...defaultHeaders,
      ...providedHeaders
    }, [
      'Accept',
      'Authorization',
      'Client-Id',
      'Content-Type',
      'CMR-Request-Id'
    ])

    this.logKeyRequest(requestedKeys, 'ingest')

    const { collectionConceptId } = params
    delete params.collectionConceptId

    const prepDataForCmr = {
      ...pick(params, this.getPermittedPublishKeys()),
      'collection-concept-id': collectionConceptId
    }

    this.response = cmrIngest({
      conceptType: this.getConceptType(),
      data: prepDataForCmr,
      headers: permittedHeaders,
      ingestPath: this.publishPath
    })
  }
}
