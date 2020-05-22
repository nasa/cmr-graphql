import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'
import { createTestClient } from 'apollo-server-testing'

import resolvers from '..'
import typeDefs from '../../types'

import collectionSource from '../../datasources/collection'
import granuleSource from '../../datasources/granule'
import serviceSource from '../../datasources/service'
import variableSource from '../../datasources/variable'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'CMR-Request-ID': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    collectionSource,
    granuleSource,
    serviceSource,
    variableSource
  })
})

describe('Collection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('services', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-ID': 'abcd-1234-efgh-5678'
        })
        .post(/services\.json/, 'page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC'
          }, {
            concept_id: 'S100001-EDSC'
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          services(first:2) {
            concept_id
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        services: [{
          concept_id: 'S100000-EDSC'
        }, {
          concept_id: 'S100001-EDSC'
        }]
      })
    })

    test('service', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-ID': 'abcd-1234-efgh-5678'
        })
        .post(/services\.json/, 'concept_id=S100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          service(concept_id: "S100000-EDSC") {
            concept_id
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        service: {
          concept_id: 'S100000-EDSC'
        }
      })
    })
  })
})
