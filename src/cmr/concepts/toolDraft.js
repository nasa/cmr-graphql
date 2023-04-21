import camelcaseKeys from 'camelcase-keys'
import {
  get,
  pick
} from 'lodash'
import snakecaseKeys from 'snakecase-keys'

import { mergeParams } from '../../utils/mergeParams'
import { mmtQuery } from '../../utils/mmtQuery'
import { parseError } from '../../utils/parseError'
import Concept from './concept'

export default class ToolDraft extends Concept {
  /**
   * Instantiates a Tool object
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('toolDraft', headers, requestInfo, params)
  }

  /**
   * Returns an array of keys representing supported search params for the umm endpoint
   */
  getPermittedUmmSearchParams() {
    return [
      'id'
    ]
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
      parseError(e, { reThrowError: true, provider: 'MMT' })
    }
  }

  /**
   * Query the CMR UMM API endpoint to retrieve requested data
   * @param {Object} searchParams Parameters provided by the query
   * @param {Array} ummKeys Keys requested by the query
   * @param {Object} headers Headers requested by the query
   */
  fetchUmm(searchParams, requestedKeys, providedHeaders) {
    this.logKeyRequest(requestedKeys, 'umm')
    return mmtQuery({
      draftType: 'ToolDraft',
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
      'Client-Id': 'mmt-react-ui',
      ...this.headers
    }
    // Construct the promise that will request data from the umm endpoint
    promises.push(
      this.fetchUmm(searchParams, ummKeys, ummHeaders)
    )
    this.response = Promise.all(promises)
  }
}
