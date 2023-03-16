import { uniq } from 'lodash'
import Concept from './concept'

export default class Granule extends Concept {
  /**
   * Instantiates a Granule object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('granules', headers, requestInfo, params)
    // Granules do not support associations
    delete this.setEssentialJsonValues
  }

  /**
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      ...super.getPermittedJsonSearchParams(),
      'bounding_box',
      'browse_only',
      'circle',
      'cloud_cover',
      'collection_concept_id',
      'cycle',
      'day_night_flag',
      'entry_id',
      'equator_crossing_date',
      'equator_crossing_longitude',
      'exclude',
      'line',
      'online_only',
      'options',
      'orbit_number',
      'passes',
      'point',
      'polygon',
      'provider',
      'readable_granule_name',
      'sort_key',
      'temporal',
      'two_d_coordinate_system'
    ]
  }

  /**
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      ...super.getPermittedUmmSearchParams(),
      'bounding_box',
      'browse_only',
      'circle',
      'cloud_cover',
      'collection_concept_id',
      'cycle',
      'day_night_flag',
      'entry_id',
      'equator_crossing_date',
      'equator_crossing_longitude',
      'exclude',
      'line',
      'online_only',
      'options',
      'orbit_number',
      'passes',
      'point',
      'polygon',
      'provider',
      'readable_granule_name',
      'sort_key',
      'temporal',
      'two_d_coordinate_system'
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
      'collection_concept_id',
      'concept_id',
      'entry_id',
      'exclude',
      'line',
      'point',
      'polygon',
      'provider',
      'readable_granule_name',
      'sort_key'
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
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummGranuleVersion}`
    }

    return super.fetchUmm(searchParams, ummKeys, ummHeaders)
  }

  /**
   * Rename fields, add fields, modify fields, etc
   * @param {Object} item The item returned from the CMR json endpoint
   */
  normalizeJsonItem(item) {
    // Alias conceptId for consistency in responses
    const {
      id: conceptId,
      links = []
    } = item

    // Rename (delete the id key and set the conceptId key) `id` for consistency
    // eslint-disable-next-line no-param-reassign
    delete item.id

    // eslint-disable-next-line no-param-reassign
    item.concept_id = conceptId

    const { linkTypes = [] } = this.params

    // If linkTypes parameter was included and links field was requested, filter the links based on linkTypes
    if (linkTypes.length && links.length) {
      // eslint-disable-next-line no-param-reassign
      item.links = links.filter((link) => {
        const { inherited, rel } = link

        // Returns true to .filter if any (.some) of the linkTypes are found in the rel field
        return linkTypes.some((linkType) => rel.includes(`/${linkType}#`) && !inherited)
      })
    }

    return item
  }
}
