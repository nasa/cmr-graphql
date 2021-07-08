import { uniq } from 'lodash'
import Concept from './concept'

export default class Granule extends Concept {
  /**
   * Instantiates a Granule object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   */
  constructor(headers, requestInfo, params) {
    super('granules', headers, requestInfo, params)
  }

  /**
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      ...super.getPermittedJsonSearchParams(),
      'bounding_box',
      'circle',
      'collection_concept_id',
      'has_granules_or_cwic',
      'has_granules',
      'include_has_granules',
      'include_tags',
      'name',
      'point',
      'polygon',
      'provider',
      'short_name',
      'temporal'
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
      'collection_concept_id',
      'point',
      'polygon',
      'temporal'
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
      'exclude',
      'line',
      'point',
      'polygon',
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
        let matchedAnyType = false

        // Only keep the link if the rel matches one of the linkTypes parameter
        linkTypes.forEach((linkType) => {
          if (rel.includes(`/${linkType}#`) && !inherited) matchedAnyType = true
        })

        return matchedAnyType
      })
    }

    return item
  }
}
