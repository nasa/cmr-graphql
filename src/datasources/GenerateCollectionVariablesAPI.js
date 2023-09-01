import { RESTDataSource } from '@apollo/datasource-rest'
import { camelCase, mapKeys } from 'lodash'

export class GenerateCollectionVariablesAPI extends RESTDataSource {
  constructor(host, token) {
    super()
    this.baseURL = `http://${host}`
    if (this.baseURL.includes('localhost')) {
      this.baseURL += '/dev'
    }
    this.token = token
  }

  formatResults(results) {
    const variables = Object.values(results)

    // return variables with keys formatted
    return variables.map((variable) => {
      // rename each collection's object keys with the camelCased version of the key
      const mappedKeys = mapKeys(variable, (value, key) => camelCase(key))

      // return the mappedKeys along with a conceptId key
      return {
        ...mappedKeys
      }
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
