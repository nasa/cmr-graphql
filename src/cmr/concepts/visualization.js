import Concept from './concept'

export default class Visualization extends Concept {
  /**
   * Instantiates a Visualization object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('visualizations', headers, requestInfo, params)
  }

  /**
   * Returns an array of keys representing supported search params for the json endpoint
   */
  getPermittedJsonSearchParams() {
    return [
      ...super.getPermittedJsonSearchParams(),
      'name',
      'provider',
      'title'
    ]
  }

  /**
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      ...super.getPermittedUmmSearchParams(),
      'name',
      'provider',
      'title'
    ]
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
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} ummKeys Keys requested by the query
   * @param {Object} headers Headers requested by the query
   */
  fetchUmm(searchParams, ummKeys, headers) {
    const ummHeaders = {
      ...headers,
      Accept: `application/vnd.nasa.cmr.umm_results+json; version=${process.env.ummVisualizationVersion}`
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
    const { ummVisualizationVersion } = env

    return super.mutateIngestParameters({
      ...params,
      MetadataSpecification: {
        URL: `https://cdn.earthdata.nasa.gov/umm/visualization/v${ummVisualizationVersion}`,
        Name: 'Visualization',
        Version: ummVisualizationVersion
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
    const { ummVisualizationVersion } = env

    return super.ingestHeaders({
      ...providedHeaders,
      'Content-Type': `application/vnd.nasa.cmr.umm+json; version=${ummVisualizationVersion}`
    })
  }
}
