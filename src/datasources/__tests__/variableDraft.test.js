import nock from 'nock'

import variableDraftDataSource from '../variableDraft'

let requestInfo

describe('variableDraft', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example-mmt.com'

    // Default requestInfo
    requestInfo = {
      name: 'variableDraft',
      alis: 'variableDraft',
      args: {},
      fieldsByTypeName: {
        VariableDraft: {
          longName: {
            name: 'longName',
            alis: 'longName',
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

  test('return the variable draft results', async () => {
    nock(/example-mmt/)
      .defaultReplyHeaders({
        'X-Request-Id': 'abcd-1234-efgh-5678'
      })
      .get(/api\/variable_drafts/)
      .reply(200, {
        draft: {
          LongName: 'Mock Long Name'
        }
      })

    const response = await variableDraftDataSource({
      draftType: 'variable_draft',
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
      longName: 'Mock Long Name'
    }])
  })
})
