import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

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
            .get(/api\/collection_drafts/)
            .reply(200, {
              draft: {
                ShortName: 'Mock ShortName'
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collectionDraft (params: { id: 123 }) {
                shortName
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

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
            .get(/api\/collection_drafts/)
            .reply(200, {})

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collectionDraft (params: { id: 123 }) {
                shortName
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

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
