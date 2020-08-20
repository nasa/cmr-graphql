import Concept from './concept'

export default class Collection extends Concept {
  /**
   * Instantiates a Collection object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   */
  constructor(headers, requestInfo) {
    super('collections', headers, requestInfo)
  }

  /**
   * Set a value in the result set that a query has not requested but is neccessary for other functionality
   * @param {String} id Concept ID to set a value for within the result set
   * @param {Object} item The item returned from the CMR json endpoint
   */
  setEssentialJsonValues(id, item) {
    super.setEssentialJsonValues(id, item)

    // Associations are used by services and variables, its required to correctly
    // retrieve those objects and shouldn't need to be provided by the client
    const { associations } = item
    if (associations) {
      this.setItemValue(id, 'associations', associations)
    }
  }

  /**
   * Set a value in the result set that a query has not requested but is neccessary for other functionality
   * @param {String} id Concept ID to set a value for within the result set
   * @param {Object} item The item returned from the CMR json endpoint
   */
  setEssentialUmmValues(id, item) {
    super.setEssentialUmmValues(id, item)

    const { meta } = item
    const { associations } = meta

    // Associations are used by services and variables, its required to correctly
    // retrieve those objects and shouldn't need to be provided by the client
    if (associations) {
      this.setItemValue(id, 'associations', associations)
    }
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
      'has_granules_or_cwic',
      'has_granules',
      'name',
      'point',
      'polygon',
      'provider',
      'short_name',
      'temporal'
    ]
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
   * Rename fields, add fields, modify fields, etc
   * @param {Object} item The item returned from the CMR json endpoint
   */
  normalizeJsonItem(item) {
    // Alias conceptId for consistency in responses
    const {
      id: conceptId,
      summary
    } = item

    // Rename (delete the id key and set the conceptId key) `id` for consistency
    // eslint-disable-next-line no-param-reassign
    delete item.id

    // eslint-disable-next-line no-param-reassign
    item.concept_id = conceptId

    // Rename (delete the summary key and set the abstract key) `summary` for consistency
    // eslint-disable-next-line no-param-reassign
    delete item.summary

    // eslint-disable-next-line no-param-reassign
    item.abstract = summary

    return item
  }
}
