import nock from 'nock'

import toolDraftDataSource from '../toolDraft'

let requestInfo

describe('toolDraft', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'toolDraft',
      alis: 'toolDraft',
      args: {},
      fieldsByTypeName: {
        ToolDraft: {
          longName: {
            name: 'longName',
            alis: 'longName',
            args: {},
            fieldsByTypeName: {}
          },
          description: {
            name: 'description',
            alis: 'description',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('return the tool draft results', async () => {
    nock(/example/)
      .defaultReplyHeaders({
        'X-Request-Id': 'abcd-1234-efgh-5678'
      })
      .get(/api\/tool_drafts/)
      .reply(200, {
        draft: {
          LongName: 'Mock Long Name',
          Description: 'Mock Description'
        }
      })

    const response = await toolDraftDataSource({
      params: {
        id: '123'
      }
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'X-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual([{
      longName: 'Mock Long Name',
      description: 'Mock Description'
    }])
  })

  test('catches errors received from mmtQuery', async () => {
    nock(/example/)
      .get(/api\/tool_drafts/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      toolDraftDataSource({
        params: {
          id: '123'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'X-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})
