import Concept from "./concept";

export default class Citation extends Concept {
  constructor(headers, requestInfo, params) {
    super('citations', headers, requestInfo, params)
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
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      ...super.getPermittedJsonSearchParams(),
      'author-name',
      'author-orcid',
      'container',
      'identifier-type',
      'identifier',
      'keyword',
      'name',
      'native-id',
      'provider',
      'related-identifier',
      'relationship-type',
      'resolution-authority',
      'title',
      'type',
      'year',
    ]
  }

  /** 
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      ...super.getPermittedUmmSearchParams(),
      'author-name',
      'author-orcid',
      'container',
      'identifier-type',
      'identifier',
      'keyword',
      'name',
      'native-id',
      'provider',
      'related-identifier',
      'relationship-type',
      'resolution-authority',
      'title',
      'type',
      'year',
    ]
  }

  /**
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} ummKeys Keys requested by the query
   * @param {Object} ummKeys Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    const ummHeaders = {
      ...headers,
      Accept: 'application/vnd.nasa.cmr.umm_results+json'
    }

    const ummResponse = super.fetchUmm(searchParams, ummKeys, ummHeaders)

    return ummResponse
  }

}