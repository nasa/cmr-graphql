import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'

import resolvers from '..'
import typeDefs from '../../types'

import dataQualitySummarySource from '../../datasources/dataQualitySummary'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'Client-Id': 'eed-test-graphql',
      'CMR-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    dataQualitySummarySource
  })
})

describe('DataQualitySummary', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })
  describe('Query', () => {
    test('All dataQualitySummary fields', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/data-quality-summaries\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'DQS100000-EDSC',
              'native-id': 'test-guid',
              'association-details': {
                collections: [
                  {
                    data: '{"key": "value", "bool": true}',
                    'concept-id': 'C100000-EDSC'
                  }
                ]
              }
            },
            umm: {
              Id: '8EA5CA1F-E339-8065-26D7-53B64074D7CC',
              Name: 'Data Quality Summary',
              Summary: 'Summary'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
            dataQualitySummaries {
                count
                items {
                  associationDetails
                  conceptId
                  id
                  name
                  nativeId
                  summary
                }
            }
          }`
      })

      const { data } = response

      expect(data).toEqual({
        dataQualitySummaries: {
          count: 1,
          items: [{
            associationDetails: {
              collections: [
                {
                  data: '{"key": "value", "bool": true}',
                  conceptId: 'C100000-EDSC'
                }]
            },
            conceptId: 'DQS100000-EDSC',
            id: '8EA5CA1F-E339-8065-26D7-53B64074D7CC',
            name: 'Data Quality Summary',
            nativeId: 'test-guid',
            summary: 'Summary'
          }]
        }
      })
    })

    test('dataQualitySummaries', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/data-quality-summaries\.json/, 'page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'DQS100000-EDSC'
          }, {
            concept_id: 'DQS100001-EDSC'
          }]
        })

      const response = await server.executeOperation({
        variables: { params: { limit: 2 } },
        query: `query($params: DataQualitySummariesInput) 
            {
                dataQualitySummaries(params: $params) {
                    items {
                        conceptId
                    }
                }
          }`
      })

      const { data } = response

      expect(data).toEqual({
        dataQualitySummaries: {
          items: [{
            conceptId: 'DQS100000-EDSC'
          }, {
            conceptId: 'DQS100001-EDSC'
          }]
        }
      })
    })

    describe('dataQualitySummary', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/data-quality-summaries\.json/, 'concept_id=DQS100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'DQS100000-EDSC'
              }, {
                concept_id: 'DQS100000-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: { params: { conceptId: 'DQS100000-EDSC' } },
            query: `
            query ($params: DataQualitySummaryInput) {
                dataQualitySummary(params: $params) {
                    conceptId
                }
              }`
          })

          const { data } = response

          expect(data).toEqual({
            dataQualitySummary: {
              conceptId: 'DQS100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/data-quality-summaries\.json/, 'concept_id=DQS100001-EDSC')
            .reply(200, {
              items: []
            })

          const response = await server.executeOperation({
            variables: { params: { conceptId: 'DQS100001-EDSC' } },
            query: `
            query ($params: DataQualitySummaryInput) {
                dataQualitySummary(params: $params) {
                    conceptId
                }
              }`
          })

          const { data } = response

          expect(data).toEqual({
            dataQualitySummary: null
          })
        })
      })
    })
  })
})
