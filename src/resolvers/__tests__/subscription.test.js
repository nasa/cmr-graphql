import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'
import { createTestClient } from 'apollo-server-testing'

import resolvers from '..'
import typeDefs from '../../types'

import collectionSource from '../../datasources/collection'
import granuleSource from '../../datasources/granule'
import serviceSource from '../../datasources/service'
import subscriptionSource from '../../datasources/subscription'
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
    subscriptionSource,
    toolSource,
    variableSource
  })
})

describe('Subscription', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all subscription fields', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/subscriptions\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'SUB100000-EDSC'
            },
            umm: {
              CollectionConceptId: 'C100000-EDSC',
              EmailAddress: 'test@example.com',
              Name: 'Test Subscription',
              Query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
              SubscriberId: 'testuser'
            }
          }]
        })

      const response = await query({
        subscriptions: {},
        query: `{
          subscriptions {
            count
            items {
              collectionConceptId
              conceptId
              emailAddress
              name
              query
              subscriberId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        subscriptions: {
          count: 1,
          items: [{
            collectionConceptId: 'C100000-EDSC',
            conceptId: 'SUB100000-EDSC',
            emailAddress: 'test@example.com',
            name: 'Test Subscription',
            query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
            subscriberId: 'testuser'
          }]
        }
      })
    })

    test('subscriptions', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/subscriptions\.json/, 'page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'SUB100000-EDSC'
          }, {
            concept_id: 'SUB100001-EDSC'
          }]
        })

      const response = await query({
        subscriptions: {},
        query: `{
          subscriptions(limit:2) {
            items {
              conceptId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        subscriptions: {
          items: [{
            conceptId: 'SUB100000-EDSC'
          }, {
            conceptId: 'SUB100001-EDSC'
          }]
        }
      })
    })

    describe('subscription', () => {
      describe('with results', () => {
        test('returns results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/subscriptions\.json/, 'concept_id=SUB100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'SUB100000-EDSC'
              }]
            })

          const response = await query({
            subscriptions: {},
            query: `{
              subscription(conceptId: "SUB100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            subscription: {
              conceptId: 'SUB100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/subscriptions\.json/, 'concept_id=SUB100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await query({
            subscriptions: {},
            query: `{
              subscription(conceptId: "SUB100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            subscription: null
          })
        })
      })
    })
  })

  describe('Subscription', () => {
    test('collection', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/subscriptions\.json/)
        .reply(200, {
          items: [{
            concept_id: 'SUB100000-EDSC',
            'collection-concept-id': 'C100000-EDSC'
          }, {
            concept_id: 'SUB100001-EDSC',
            'collection-concept-id': 'C100003-EDSC'
          }]
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/, 'concept_id=C100000-EDSC&page_size=20')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/, 'concept_id=C100003-EDSC&page_size=20')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100003-EDSC'
            }]
          }
        })

      const response = await query({
        variables: {},
        query: `{
          subscriptions {
            items {
              conceptId
              collection {
                conceptId
              }
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        subscriptions: {
          items: [{
            conceptId: 'SUB100000-EDSC',
            collection: {
              conceptId: 'C100000-EDSC'
            }
          }, {
            conceptId: 'SUB100001-EDSC',
            collection: {
              conceptId: 'C100003-EDSC'
            }
          }]
        }
      })
    })
  })
})
