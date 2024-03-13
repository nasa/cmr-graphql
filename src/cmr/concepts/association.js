import { snakeCase } from 'lodash'
import { pickIgnoringCase } from '../../utils/pickIgnoringCase'
import Concept from './concept'
import { parseError } from '../../utils/parseError'
import { cmrVariableAssociation } from '../../utils/cmrVariableAssociation'
import { cmrAssociation } from '../../utils/cmrAssociation'
import { cmrDeleteAssociation } from '../../utils/cmrDeleteAssociation'

export default class Association extends Concept {
  /**
   * Parse and return the body of an ingest operation
   * @param {Object} ingestResponse HTTP response from the CMR endpoint
   */
  parseAssociationBody(ingestResponse) {
    const { data } = ingestResponse

    return data[0]
  }

  /**
   * Parses the response from an create
   * @param {Object} requestInfo Parsed data pertaining to the create operation
   */
  async parseAssociationResponse(requestInfo) {
    try {
      const {
        ingestKeys
      } = requestInfo

      const result = await this.getResponse()

      const data = this.parseAssociationBody(result)

      ingestKeys.forEach((key) => {
        const cmrKey = snakeCase(key)

        const { [cmrKey]: keyValue } = data

        this.setIngestValue(key, keyValue)
      })
    } catch (e) {
      parseError(e, { reThrowError: true })
    }
  }

  /**
   * Create the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  create(data, requestedKeys, providedHeaders) {
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/vnd.nasa.cmr.umm+json'
    }

    this.logKeyRequest(requestedKeys, 'association')

    // Merge default headers into the provided headers and then pick out only permitted values
    const permittedHeaders = pickIgnoringCase({
      ...defaultHeaders,
      ...providedHeaders
    }, [
      'Accept',
      'Authorization',
      'Client-Id',
      'Content-Type',
      'CMR-Request-Id'
    ])

    this.response = cmrAssociation({
      conceptType: this.getConceptType(),
      data,
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: permittedHeaders
    })
  }

  /**
   * Create the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  createVariable(data, requestedKeys, providedHeaders) {
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/vnd.nasa.cmr.umm+json'
    }

    this.logKeyRequest(requestedKeys, 'association')

    // Merge default headers into the provided headers and then pick out only permitted values
    const permittedHeaders = pickIgnoringCase({
      ...defaultHeaders,
      ...providedHeaders
    }, [
      'Accept',
      'Authorization',
      'Client-Id',
      'Content-Type',
      'CMR-Request-Id'
    ])

    this.response = cmrVariableAssociation({
      conceptType: this.getConceptType(),
      data,
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: permittedHeaders
    })
  }

  /**
   * Delete the provided object into the CMR
   * @param {Object} data Parameters provided by the query
   * @param {Array} requestedKeys Keys requested by the query
   * @param {Object} providedHeaders Headers requested by the query
   */
  deleteAssociation(data, requestedKeys, providedHeaders) {
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/vnd.nasa.cmr.umm+json'
    }

    this.logKeyRequest(requestedKeys, 'association')

    // Merge default headers into the provided headers and then pick out only permitted values
    const permittedHeaders = pickIgnoringCase({
      ...defaultHeaders,
      ...providedHeaders
    }, [
      'Accept',
      'Authorization',
      'Client-Id',
      'Content-Type',
      'CMR-Request-Id'
    ])

    this.response = cmrDeleteAssociation({
      conceptType: this.getConceptType(),
      data,
      nonIndexedKeys: this.getNonIndexedKeys(),
      headers: permittedHeaders
    })
  }
}
