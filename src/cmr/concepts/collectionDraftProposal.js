import camelcaseKeys from 'camelcase-keys'
import {
  get,
  pick
} from 'lodash'
import snakecaseKeys from 'snakecase-keys'

import { draftMmtQuery } from '../../utils/draftMmtQuery'
import { mergeParams } from '../../utils/mergeParams'
import { parseError } from '../../utils/parseError'

import Concept from './concept'

export default class CollectionDraftProposal extends Concept {
  /**
   * Instantiates a Collection object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('collectionDraftProposal', headers, requestInfo, params)
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

      // Loop through the requested umm keys
      ummKeys.forEach((ummKey) => {
        // Use lodash.get to retrieve a value from the umm response given the
        // path we've defined above
        const keyValue = get(data, ummKeyMappings[ummKey])

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
      parseError(e, { reThrowError: true, provider: 'MMT' })
    }
  }

  fetchUmm(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'umm')

    // Construct the promise that will request data from the umm endpoint
    return draftMmtQuery({
      conceptType: this.getConceptType(),
      params: pick(snakecaseKeys(searchParams), this.getPermittedUmmSearchParams()),
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: providedHeaders
    })
  }

  fetch(searchParams) {
    // eslint-disable-next-line no-param-reassign
    searchParams = mergeParams(searchParams)

    // Default an array to hold the promises we need to make depending on the requested fields
    const promises = []

    const { ummKeys } = this.requestInfo

    const ummHeaders = {
      ...this.headers
    }

    // Construct the promise that will request data from the umm endpoint
    promises.push(
      this.fetchUmm(searchParams, ummKeys, ummHeaders)
    )

    this.response = Promise.all(promises)
  }
}
