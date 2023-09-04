import { RESTDataSource } from '@apollo/datasource-rest'
import { camelCase, mapKeys } from 'lodash'

export class CollectionVariableDrafts extends RESTDataSource {
  constructor(host, token) {
    super()
    if (host.includes('localhost')) {
      this.baseURL = `http://${host}/dev`
    } else {
      this.baseURL = `https://${host}`
    }
    this.token = token
  }

  formatResults(results) {
    const variables = Object.values(results)

    // return variables with keys formatted
    return variables.map((variable) => {
      // rename each collection's object keys with the camelCased version of the key
      const mappedKeys = mapKeys(variable, (value, key) => camelCase(key))

      // return the mappedKeys
      return mappedKeys
    })
  }

  willSendRequest(request) {
    // set the headers for the request
    request.headers.authorization = this.token
  }

  async generateVariables(collectionConceptId) {
    // generate variables from earthdata-varinfo lambda
    const results = await this.get(`earthdataVarinfo/?collection_concept_id=${collectionConceptId}`)

    return this.formatResults(results)
  }
}
