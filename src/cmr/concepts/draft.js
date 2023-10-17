import { uniq } from 'lodash'

import { pickIgnoringCase } from '../../utils/pickIgnoringCase'
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

    const singularConceptType = conceptType.replace('drafts', 'draft')
    const {
      providerId,
      ummVersion
    } = params

    this.ingestPath = `providers/${providerId}/${conceptType}`
    this.metadataSpecification = {
      URL: `https://cdn.earthdata.nasa.gov/umm/${singularConceptType}/v${ummVersion}`,
      Name: singularConceptType,
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

    // Add MetadataSpecification to the data
    // eslint-disable-next-line no-param-reassign
    data.metadataSpecification = this.metadataSpecification

    const metadata = {
      metadataSpecification: this.metadataSpecification,
      nativeId: data.nativeId,
      ...data.metadata
    }

    super.ingest(metadata, requestedKeys, permittedHeaders)
  }
}
