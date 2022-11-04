import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'

import resolvers from '..'
import typeDefs from '../../types'

import collectionSource from '../../datasources/collection'
import collectionDraftSource from '../../datasources/collectionDraft'
import collectionDraftProposalSource from '../../datasources/collectionDraftProposal'
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
      'X-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    collectionSource,
    collectionDraftSource,
    collectionDraftProposalSource,
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

    process.env.draftMmtRootUrl = 'http://example.com'
    process.env.dmmtSslCert = '-----BEGIN CERTIFICATE-----\nmock-certificate\n-----END CERTIFICATE-----'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    describe('collectionDraftProposal', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collection_draft_proposals/)
            .reply(200, {
              ShortName: 'Mock ShortName'
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collectionDraftProposal (params: { id: 123 }) {
                shortName
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collectionDraftProposal: {
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
            .get(/collection_draft_proposals/)
            .reply(200, {})

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collectionDraftProposal (params: { id: 123 }) {
                shortName
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            collectionDraftProposal: {
              shortName: null
            }
          })
        })
      })
    })
  })
})
