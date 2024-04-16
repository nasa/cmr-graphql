import Concept from './concept'

import { mergeParams } from '../../utils/mergeParams'

export default class Association extends Concept {
  /**
   * Instantiates an ACL object from the CMR API
   * @param {Object} headers HTTP headers provided by the query
   * @param {Object} requestInfo Parsed data pertaining to the Graph query
   * @param {Object} params GraphQL query parameters
   */
  constructor(headers, requestInfo, params) {
    super('associations', headers, requestInfo, params)
  }

  /**
   * Mutate the provided values from the user to meet expectations from CMR
   * @param {Object} params Parameters provided by the client
   * @returns The payload to send to CMR
   */
  mutateIngestParameters(params) {
    const {
      associatedConceptId,
      associatedConceptIds,
      associatedConceptData
    } = params

    if (associatedConceptId) {
      return [{ concept_id: associatedConceptId }]
    }

    if (associatedConceptIds) {
      return associatedConceptIds.map((id) => ({ concept_id: id }))
    }

    return associatedConceptData
  }

  /**
   * Mutate the provided values from the user to meet expectations from CMR
   * @param {Object} params Parameters provided by the client
   * @returns The payload to send to CMR
   */
  mutateDeleteParameters(params) {
    return this.mutateIngestParameters(params)
  }

  /**
   * Parse and return the body of an ingest operation
   * @param {Object} ingestResponse HTTP response from the CMR endpoint
   */
  parseIngestBody(ingestResponse, ingestKeys) {
    const { data } = ingestResponse

    data.forEach((item, itemIndex) => {
      const {
        associated_item: associatedItem,
        generic_association: genericAssociation
      } = item

      const {
        concept_id: conceptId,
        revision_id: revisionId
      } = genericAssociation

      const {
        concept_id: associatedConceptId
      } = associatedItem

      const formattedItem = {
        associatedConceptId,
        conceptId,
        revisionId
      }

      const itemKey = `${conceptId}-${itemIndex}`

      ingestKeys.forEach((key) => {
        const { [key]: keyValue } = formattedItem

        this.setItemValue(itemKey, key, keyValue)
      })
    })
  }

  /**
   * Return the ingest result set formatted for the graphql json response
   */
  getFormattedIngestResponse() {
    // Retrieve the result set regardless of whether or not the query is a list or not
    const items = this.getItems()

    return Object.values(items)
  }

  /**
   * Ingest the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  ingest(data, requestedKeys, providedHeaders, options) {
    const params = mergeParams(data)

    const {
      conceptId
    } = params

    super.ingest(params, requestedKeys, providedHeaders, {
      ...options,
      method: 'POST',
      path: `search/associate/${conceptId}`
    })
  }

  /**
   * Delete the provided object from CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  delete(data, requestedKeys, providedHeaders, options) {
    const params = mergeParams(data)

    const { conceptId } = params

    super.delete(params, requestedKeys, providedHeaders, {
      ...options,
      method: 'DELETE',
      path: `search/associate/${conceptId}`
    })
  }
}
