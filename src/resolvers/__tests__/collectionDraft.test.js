import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'

import resolvers from '..'
import typeDefs from '../../types'

import collectionSource from '../../datasources/collection'
import collectionDraftSource from '../../datasources/collectionDraft'
import granuleSource from '../../datasources/granule'
import graphDbSource from '../../datasources/graphDb'
import serviceSource from '../../datasources/service'
import {
  deleteSubscription as subscriptionSourceDelete,
  fetchSubscription as subscriptionSourceFetch,
  ingestSubscription as subscriptionSourceIngest
} from '../../datasources/subscription'
import toolSource from '../../datasources/tool'
import variableSource from '../../datasources/variable'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'Client-Id': 'eed-test-graphql',
      'X-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    collectionSource,
    collectionDraftSource,
    granuleSource,
    graphDbSource,
    serviceSource,
    subscriptionSourceDelete,
    subscriptionSourceFetch,
    subscriptionSourceIngest,
    toolSource,
    variableSource
  })
})

describe('Collection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    describe('collectionDraft', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collection_drafts/)
            .reply(200, {
              ShortName: 'Mock ShortName'
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collectionDraft (params: { id: 123 }) {
                shortName
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collectionDraft: {
              shortName: 'Mock ShortName'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collection_drafts/)
            .reply(200, {})

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collectionDraft (params: { id: 123 }) {
                shortName
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collectionDraft: {
              shortName: null
            }
          })
        })
      })
    })
  })
})
