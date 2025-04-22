import camelcaseKeys from 'camelcase-keys'

import pick from 'lodash/pick'
import uniq from 'lodash/uniq'

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
      draftConceptId
    } = params

    this.publishPath = `publish/${draftConceptId}`
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
   * Mutate the provided values from the user to meet expectations from CMR
   * @param {Object} params Parameters provided by the client
   * @returns The payload to send to CMR
   */
  mutateDeleteParameters(params) {
    return camelcaseKeys(params, {
      pascalCase: true,
      exclude: ['nativeId', 'providerId']
    })
  }

  /**
   * Delete the provided object from CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  delete(data, requestedKeys, providedHeaders, options) {
    // Construct the promise that will delete data from CMR
    super.delete(
      data,
      requestedKeys,
      {
        ...providedHeaders,
        'Content-Type': 'application/vnd.nasa.cmr.umm+json'
      },
      options
    )
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
   * Mutate the provided values from the user to meet expectations from CMR
   * @param {Object} params Parameters provided by the client
   * @returns The payload to send to CMR
   */
  mutateIngestParameters(params) {
    const { env } = process
    const {
      ummCollectionVersion,
      ummServiceVersion,
      ummToolVersion,
      ummVariableVersion,
      ummVisualizationVersion
    } = env

    const { conceptType } = params

    const metadataSpecificationByConceptType = {
      'collection-drafts': {
        ummName: 'UMM-C',
        ummType: 'collection',
        ummVersion: ummCollectionVersion
      },
      'service-drafts': {
        ummName: 'UMM-S',
        ummType: 'service',
        ummVersion: ummServiceVersion
      },
      'tool-drafts': {
        ummName: 'UMM-T',
        ummType: 'tool',
        ummVersion: ummToolVersion
      },
      'variable-drafts': {
        ummName: 'UMM-Var',
        ummType: 'variable',
        ummVersion: ummVariableVersion
      },
      'visualization-drafts': {
        ummName: 'Visualization',
        ummType: 'visualization',
        ummVersion: ummVisualizationVersion
      }
    }

    const {
      [`${conceptType.toLowerCase()}-drafts`]: specificationData
    } = metadataSpecificationByConceptType

    const {
      ummName,
      ummType,
      ummVersion
    } = specificationData

    return super.mutateIngestParameters({
      ...params.metadata,
      MetadataSpecification: {
        URL: `https://cdn.earthdata.nasa.gov/umm/${ummType}/v${ummVersion}`,
        Name: ummName,
        Version: ummVersion
      }
    })
  }

  /**
   * Merge provided and default headers and ensure they are permitted
   * @param {Object} providedHeaders Headers provided by the client
   * @returns An object holding acceptable headers and their values
   */
  ingestHeaders(providedHeaders) {
    const { env } = process
    const {
      ummCollectionVersion,
      ummServiceVersion,
      ummToolVersion,
      ummVariableVersion,
      ummVisualizationVersion
    } = env

    const { conceptType } = this.params

    const ummVersionByConceptType = {
      'collection-drafts': ummCollectionVersion,
      'service-drafts': ummServiceVersion,
      'tool-drafts': ummToolVersion,
      'variable-drafts': ummVariableVersion,
      'visualization-drafts': ummVisualizationVersion
    }

    const {
      [`${conceptType.toLowerCase()}-drafts`]: ummVersion
    } = ummVersionByConceptType

    return super.ingestHeaders({
      ...providedHeaders,
      'Content-Type': `application/vnd.nasa.cmr.umm+json; version=${ummVersion}`
    })
  }

  publish(data, requestedKeys, providedHeaders) {
    const { draftConceptId, nativeId, ummVersion } = data

    // eslint-disable-next-line no-param-reassign
    delete data.nativeId

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

    // Calling cmrIngest directly because the ingest path is different for publish.
    this.response = cmrIngest({
      conceptType: this.getConceptType(),
      data: prepDataForCmr,
      headers: permittedHeaders,
      options: {
        path: `ingest/publish/${draftConceptId}/${encodeURIComponent(nativeId)}`
      }
    })
  }
}
