import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

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
              'Client-Id': 'eed-test-graphql',
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
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

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
              'Client-Id': 'eed-test-graphql',
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
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

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
