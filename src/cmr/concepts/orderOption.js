import Concept from './concept'

export default class OrderOption extends Concept {
  /**
   * Instantiates an OrderOption object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    // This concept uses the "-" character to delineate spaces in CMR we must pass it
    // in this form to fetch order option concepts from CMR
    super('order-options', headers, requestInfo, params)
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
    // TODO: When generics support versioning we need to update this concept
    const ummHeaders = {
      ...headers,
      Accept: 'application/vnd.nasa.cmr.umm_results+json'
    }
    const ummResponse = super.fetchUmm(searchParams, ummKeys, ummHeaders)

    return ummResponse
  }

  /**
   * Mutate the provided values from the user to meet expectations from CMR
   * @param {Object} params Parameters provided by the client
   * @returns The payload to send to CMR
   */
  mutateIngestParameters(params) {
    const { env } = process
    const { ummOrderOptionVersion } = env

    return {
      ...params,
      MetadataSpecification: {
        URL: `https://cdn.earthdata.nasa.gov/generics/order-option/v${ummOrderOptionVersion}`,
        Name: 'Order Option',
        Version: ummOrderOptionVersion
      }
    }
  }

  /**
   * Merge provided and default headers and ensure they are permitted
   * @param {Object} providedHeaders Headers provided by the client
   * @returns An object holding acceptable headers and their values
   */
  ingestHeaders(providedHeaders) {
    const { env } = process
    const { ummOrderOptionVersion } = env

    return super.ingestHeaders({
      ...providedHeaders,
      'Content-Type': `application/vnd.nasa.cmr.umm+json; version=${ummOrderOptionVersion}`
    })
  }
}
