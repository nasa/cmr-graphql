import nock from 'nock'

import {
  buildContextValue,
  server
} from './__mocks__/mockServer'

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
    describe('toolDraft', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/api\/tool_drafts/)
            .reply(200, {
              draft: {
                DOI: 'Mock doi'
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              toolDraft (params: { id: 123 }) {
                doi
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            toolDraft: {
              doi: 'Mock doi'
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
            .get(/api\/tool_drafts/)
            .reply(200, {})

          const response = await server.executeOperation({
            variables: {},
            query: `{
              toolDraft (params: { id: 123 }) {
                doi
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            toolDraft: {
              doi: null
            }
          })
        })
      })
    })
  })
})
