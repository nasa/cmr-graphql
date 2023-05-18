import nock from 'nock'

import {
  buildContextValue,
  server
} from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Variable Draft', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    describe('variableDraft', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/api\/variable_drafts/)
            .reply(200, {
              draft: {
                StandardName: 'Mock Standard Name'
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              variableDraft (params: { id: 123 }) {
                standardName
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            variableDraft: {
              standardName: 'Mock Standard Name'
            }
          })
        })
      })
    })
  })
})
