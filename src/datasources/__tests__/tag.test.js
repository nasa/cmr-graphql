import nock from 'nock'
import tagSource from '../tag'

let requestInfo
describe('tags', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'tags',
      alias: 'tags',
      args: {},
      fieldsByTypeName: {
        TagList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              conceptId: {
                name: 'conceptId',
                alias: 'conceptId',
                args: {},
                fieldsByTypeName: {}
              },
              tagKey: {
                name: 'tagKey',
                alias: 'tagKey',
                args: {},
                fieldsByTypeName: {}
              }
            }
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('cursor', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'acls',
        alias: 'acls',
        args: {},
        fieldsByTypeName: {
          TagList: {
            cursor: {
              name: 'cursor',
              alias: 'cursor',
              args: {},
              fieldsByTypeName: {
                conceptId: {
                  name: 'conceptId',
                  alias: 'conceptId',
                  args: {},
                  fieldsByTypeName: {}
                },
                tagKey: {
                  name: 'tagKey',
                  alias: 'tagKey',
                  args: {},
                  fieldsByTypeName: {}
                }
              }
            }
          }
        }
      }
    })

    test('returns a cursor', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Search-After': '["xyz", 789, 999]'
        })
        .get(/tags/)
        .reply(200, {
          items: [{
            concept_id: 'C100000'
          }]
        })

      const response = await tagSource({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJqc29uIjoiW1wieHl6XCIsIDc4OSwgOTk5XSJ9',
        items: [{
          conceptId: 'C100000'
        }]
      })
    })
  })
})
