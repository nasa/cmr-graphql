import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'
import { createTestClient } from 'apollo-server-testing'

import resolvers from '..'
import typeDefs from '../../types'

import collectionSource from '../../datasources/collection'
import granuleSource from '../../datasources/granule'
import serviceSource from '../../datasources/service'
import toolSource from '../../datasources/tool'
import variableSource from '../../datasources/variable'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'CMR-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    collectionSource,
    granuleSource,
    serviceSource,
    toolSource,
    variableSource
  })
})

describe('Service', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all service fields', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/services\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'S100000-EDSC'
            },
            umm: {
              Description: 'Parturient Dolor Cras Aenean Dapibus',
              LongName: 'Parturient Egestas Lorem',
              Name: 'Parturient',
              RelatedURLs: [],
              ServiceOptions: {
                SupportedReformattings: [{
                  SupportedInputFormats: '',
                  SupportedOutputFormats: []
                }]
              },
              Type: 'Tristique',
              URL: {}
            }
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          services {
            count
            items {
              conceptId
              description
              longName
              name
              relatedUrls
              serviceOptions
              supportedReformattings
              type
              url
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        services: {
          count: 1,
          items: [{
            conceptId: 'S100000-EDSC',
            description: 'Parturient Dolor Cras Aenean Dapibus',
            longName: 'Parturient Egestas Lorem',
            name: 'Parturient',
            relatedUrls: [],
            serviceOptions: {
              supportedReformattings: [{
                supportedInputFormats: '',
                supportedOutputFormats: []
              }]
            },
            supportedReformattings: [{
              supportedInputFormats: '',
              supportedOutputFormats: []
            }],
            type: 'Tristique',
            url: {}
          }]
        }
      })
    })

    test('services', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
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
          services(limit:2) {
            items {
              conceptId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        services: {
          items: [{
            conceptId: 'S100000-EDSC'
          }, {
            conceptId: 'S100001-EDSC'
          }]
        }
      })
    })

    describe('service', () => {
      describe('with results', () => {
        test('returns results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
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
              service(conceptId: "S100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            service: {
              conceptId: 'S100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id=S100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await query({
            variables: {},
            query: `{
              service(conceptId: "S100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            service: null
          })
        })
      })
    })
  })
})
