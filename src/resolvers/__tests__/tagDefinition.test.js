import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Tag', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('tagsDefinition', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/tags/)
        .reply(200, {
          items: [
            {
              concept_id: 'C100000',
              tag_key: 'Mock tag key',
              description: 'Mock tag description.',
              revision_id: '1',
              originator_id: 'test-user'
            }
          ]
        })

      const response = await server.executeOperation({
        variables: {
          params: {
            tagKey: ['Mock Tag Key']
          }
        },
        query: `
          query TagDefinitions($params: TagDefinitionsInput) {
            tagDefinitions(params: $params) {
              items {
                conceptId
                tagKey
                description
                revisionId
                originatorId
              }
            }
          }
        `
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        tagDefinitions: {
          items: [{
            conceptId: 'C100000',
            tagKey: 'Mock tag key',
            description: 'Mock tag description.',
            revisionId: '1',
            originatorId: 'test-user'
          }]
        }
      })
    })
  })
})
