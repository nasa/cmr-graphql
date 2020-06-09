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

describe('Variable', () => {
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
    test('variables', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-ID': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/, 'page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC'
          }, {
            concept_id: 'V100001-EDSC'
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          variables(first:2) {
            items {
              conceptId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        variables: {
          items: [{
            conceptId: 'V100000-EDSC'
          }, {
            conceptId: 'V100001-EDSC'
          }]
        }
      })
    })

    test('variable', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-ID': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/, 'concept_id=V100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC',
            long_name: 'Cras mattis consectetur purus sit amet fermentum.',
            name: 'Lorem Ipsum'
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          variable(conceptId: "V100000-EDSC") {
            conceptId
            longName
            name
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        variable: {
          conceptId: 'V100000-EDSC',
          longName: 'Cras mattis consectetur purus sit amet fermentum.',
          name: 'Lorem Ipsum'
        }
      })
    })
  })
})
