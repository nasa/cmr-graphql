import camelcaseKeys from 'camelcase-keys'
import get from 'lodash/get'
import pick from 'lodash/pick'
import snakecaseKeys from 'snakecase-keys'

import { mergeParams } from '../../utils/mergeParams'
import { mmtQuery } from '../../utils/mmtQuery'
import { parseError } from '../../utils/parseError'

import Concept from './concept'

export default class DraftConcept extends Concept {
  /**
   * Instantiates a Collection object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   * @param {Object} conceptType Passed in conceptType from DataSource
   */

  constructor(headers, requestInfo, params, conceptType) {
    super(conceptType, headers, requestInfo, params)
  }

  /**
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      'id'
    ]
  }

  /**
   * Retrieve the request id header from the request
   * @param {Object} headers The provided headers from the query
   * @return {String} Request ID defined in the headers
   */
  getRequestId() {
    const {
      'X-Request-Id': requestId
    } = this.headers

    return requestId
  }

  async parse(requestInfo, params) {
    const { id } = params

    try {
      const {
        ummKeyMappings,
        ummKeys
      } = requestInfo

      const [response] = await this.getResponse()
      const { data } = response

      const { draft } = data

      // Loop through the requested umm keys
      ummKeys.forEach((ummKey) => {
        // Use lodash.get to retrieve a value from the umm response given the
        // path we've defined above
        const keyValue = get(draft, ummKeyMappings[ummKey])

        const camelCasedObject = camelcaseKeys({ [ummKey]: keyValue }, { deep: true })

        const { [ummKey]: camelCasedValue } = camelCasedObject

        // Camel case all of the keys of this object (ummKey is already camel cased)
        this.setItemValue(
          `${id}`,
          ummKey,
          camelCasedValue
        )
      })
    } catch (e) {
      parseError(e, {
        reThrowError: true,
        provider: 'MMT'
      })
    }
  }

  fetchUmm(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'umm')

    // Construct the promise that will request data from the umm endpoint
    return mmtQuery({
      draftType: this.getConceptType(),
      params: pick(snakecaseKeys(searchParams), this.getPermittedUmmSearchParams()),
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: providedHeaders
    })
  }

  fetch(searchParams) {
    const params = mergeParams(searchParams)

    // Default an array to hold the promises we need to make depending on the requested fields
    const promises = []

    const { ummKeys } = this.requestInfo

    const ummHeaders = this.headers

    // Construct the promise that will request data from the umm endpoint
    promises.push(
      this.fetchUmm(params, ummKeys, ummHeaders)
    )

    this.response = Promise.all(promises)
  }
}
