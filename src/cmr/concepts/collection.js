import camelcaseKeys from 'camelcase-keys'
import uniq from 'lodash/uniq'

import Concept from './concept'

export default class Collection extends Concept {
  /**
   * Instantiates a Collection object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('collections', headers, requestInfo, params)
  }

  /**
   * Set a value in the result set that a query has not requested but is necessary for other functionality
   * @param {String} id Concept ID to set a value for within the result set
   * @param {Object} item The item returned from the CMR json endpoint
   */
  setEssentialUmmValues(id, item) {
    super.setEssentialUmmValues(id, item)

    const { meta } = item
    const { 'association-details': associationDetails } = meta

    const formattedAssociationDetails = camelcaseKeys(associationDetails, { deep: true })

    // Associations are used by services, tools, and variables, it's required to correctly
    // retrieve those objects and shouldn't need to be provided by the client
    if (associationDetails) {
      this.setItemValue(id, 'associationDetails', formattedAssociationDetails)
    }
  }

  /**
   * Return facets associated with the collection results
   */
  getFacets() {
    return this.facets
  }

  /**
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      ...super.getPermittedJsonSearchParams(),
      'bounding_box',
      'circle',
      'cloud_hosted',
      'collection_concept_id',
      'collection_data_type',
      'consortium',
      'data_center',
      'data_center_h',
      'doi',
      'entry_id',
      'entry_title',
      'facets_size',
      'granule_data_format',
      'granule_data_format_h',
      'has_granules_or_cwic',
      'has_granules',
      'has_opendap_url',
      'horizontal_data_resolution_range',
      'include_facets',
      'include_has_granules',
      'include_tags',
      'instrument',
      'instrument_h',
      'keyword',
      'latency',
      'line',
      'options',
      'platform',
      'platforms_h',
      'point',
      'polygon',
      'processing_level_id',
      'processing_level_id_h',
      'project',
      'project_h',
      'provider',
      'revision_date',
      'updated_since',
      'science_keywords',
      'science_keywords_h',
      'service_concept_id',
      'service_type',
      'short_name',
      'spatial_keyword',
      'standard_product',
      'tag_key',
      'temporal',
      'tool_concept_id',
      'two_d_coordinate_system_name',
      'variable_concept_id',
      'version'
    ]
  }

  /**
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      ...super.getPermittedUmmSearchParams(),
      'bounding_box',
      'circle',
      'cloud_hosted',
      'collection_concept_id',
      'collection_data_type',
      'consortium',
      'data_center',
      'data_center_h',
      'doi',
      'entry_id',
      'entry_title',
      'granule_data_format',
      'granule_data_format_h',
      'has_granules_or_cwic',
      'has_granules',
      'has_opendap_url',
      'horizontal_data_resolution_range',
      'include_has_granules',
      'instrument',
      'instrument_h',
      'keyword',
      'latency',
      'line',
      'options',
      'platform',
      'platforms_h',
      'point',
      'polygon',
      'processing_level_id',
      'processing_level_id_h',
      'project',
      'project_h',
      'provider',
      'updated_since',
      'revision_date',
      'science_keywords',
      'science_keywords_h',
      'service_concept_id',
      'service_type',
      'short_name',
      'spatial_keyword',
      'standard_product',
      'tag_key',
      'temporal',
      'tool_concept_id',
      'two_d_coordinate_system_name',
      'variable_concept_id',
      'version'
    ]
  }

  /**
   * Returns an array of keys that should not be indexed when sent to CMR
   */
  getNonIndexedKeys() {
    return uniq([
      ...super.getNonIndexedKeys(),
      'bounding_box',
      'circle',
      'collection_data_type',
      'concept_id',
      'consortium',
      'data_center',
      'data_center_h',
      'doi',
      'entry_id',
      'entry_title',
      'granule_data_format_h',
      'granule_data_format',
      'horizontal_data_resolution_range',
      'instrument_h',
      'instrument',
      'latency',
      'line',
      'platform',
      'point',
      'polygon',
      'processing_level_id_h',
      'project_h',
      'provider',
      'updated_since',
      'revision_date',
      'science_keywords',
      'service_concept_id',
      'service_type',
      'short_name',
      'sort_key',
      'spatial_keyword',
      'tag_key',
      'tool_concept_id',
      'two_d_coordinate_system_name',
      'variable_concept_id',
      'version'
    ])
  }

  /**
   * Return the result set formatted for the graphql json response
   */
  getFormattedResponse() {
    // Determine if the query was a list or not, list queries return meta
    // keys using a slightly different format
    const {
      isList,
      metaKeys
    } = this.requestInfo

    // While technically the facets are available with a single collection because we use the
    // search endpoint, we don't support it in the response so we'll only return facets when
    // when the user has requested the list response
    if (isList && metaKeys.includes('collectionFacets')) {
      // Included the facets in the metakeys returned
      return {
        facets: this.getFacets(),
        ...super.getFormattedResponse()
      }
    }

    // Facets were not requested, fall back to the default response
    return super.getFormattedResponse()
  }

  /**
   * Parse and return the array of data from the nested response body
   * @param {Object} jsonResponse HTTP response from the CMR endpoint
   */
  parseJsonBody(jsonResponse) {
    const { data } = jsonResponse

    const { feed } = data

    const { entry, facets } = feed

    // Store the facets (potentially) returned by the request
    this.facets = camelcaseKeys(facets, { deep: true })

    return entry
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
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummCollectionVersion}`
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
    const { ummCollectionVersion } = env

    return super.mutateIngestParameters({
      ...params,
      MetadataSpecification: {
        URL: `https://cdn.earthdata.nasa.gov/umm/collection/v${ummCollectionVersion}`,
        Name: 'UMM-C',
        Version: ummCollectionVersion
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
    const { ummCollectionVersion } = env

    return super.ingestHeaders({
      ...providedHeaders,
      'Content-Type': `application/vnd.nasa.cmr.umm+json; version=${ummCollectionVersion}`
    })
  }

  /**
   * Rename fields, add fields, modify fields, etc
   * @param {Object} item The item returned from the CMR json endpoint
   */
  normalizeJsonItem(item) {
    // Alias conceptId for consistency in responses
    const {
      id: conceptId,
      data_center: dataCenter,
      original_format: originalFormat,
      summary
    } = item

    // Rename (delete the id key and set the conceptId key) `id` for consistency
    // eslint-disable-next-line no-param-reassign
    delete item.id

    // Alias summary offering the same value using a different key to allow clients to transition
    // eslint-disable-next-line no-param-reassign
    item.abstract = summary

    // eslint-disable-next-line no-param-reassign
    item.concept_id = conceptId

    // Rename original format
    // eslint-disable-next-line no-param-reassign
    item.metadata_format = originalFormat

    // eslint-disable-next-line no-param-reassign
    item.provider = dataCenter

    return item
  }

  /**
   * Rename fields, add fields, modify fields, etc
   * @param {Object} item The item returned from the CMR umm endpoint
   */
  normalizeUmmItem(item) {
    const { umm = {} } = item

    const { ArchiveAndDistributionInformation: archiveAndDistributionInformation = {} } = umm

    let fileDistributionInformation = [];

    ({
      FileDistributionInformation: fileDistributionInformation = []
    } = archiveAndDistributionInformation)

    const formats = []

    fileDistributionInformation.forEach((info) => {
      const {
        Format: format,
        FormatType: formatType
      } = info

      if (
        formatType
        && format
        && formatType.toLowerCase() === 'native'
        && format.toLowerCase() !== 'not provided'
      ) {
        formats.push(format)
      }
    })

    // Append a custom key to the UMM response for curated data
    // eslint-disable-next-line no-param-reassign
    item.custom = {
      NativeDataFormats: uniq(formats)
    }

    return item
  }
}
