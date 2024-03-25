import nock from 'nock'

import serviceDraftDataSource from '../serviceDraft'

let requestInfo

describe('serviceDraft', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example-mmt.com'

    // Default requestInfo
    requestInfo = {
      name: 'serviceDraft',
      alis: 'serviceDraft',
      args: {},
      fieldsByTypeName: {
        ServiceDraft: {
          name: {
            name: 'name',
            alis: 'name',
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

  test('return the service draft results', async () => {
    nock(/example-mmt/)
      .defaultReplyHeaders({
        'X-Request-Id': 'abcd-1234-efgh-5678'
      })
      .get(/api\/service_drafts/)
      .reply(200, {
        draft: {
          Name: 'Mock Name',
          Description: 'Mock Description'
        }
      })

    const response = await serviceDraftDataSource({
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
      name: 'Mock Name',
      description: 'Mock Description'
    }])
  })

  test('catches errors received from mmtQuery', async () => {
    nock(/example-mmt/)
      .get(/api\/service_drafts/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      serviceDraftDataSource({
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
