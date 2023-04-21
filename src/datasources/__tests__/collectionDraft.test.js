import nock from 'nock'

import collectionDraftDatasource from '../collectionDraft'

let requestInfo

describe('collectionDraft', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'collectionDraft',
      alias: 'collectionDraft',
      args: {},
      fieldsByTypeName: {
        CollectionDraft: {
          abstract: {
            name: 'abstract',
            alias: 'abstract',
            args: {},
            fieldsByTypeName: {}
          },
          shortName: {
            name: 'shortName',
            alias: 'shortName',
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

  test('returns the collection draft results', async () => {
    nock(/example/)
      .defaultReplyHeaders({
        'X-Request-Id': 'abcd-1234-efgh-5678'
      })
      .get(/api\/drafts/)
      .reply(200, {
        draft: {
          Abstract: 'Mock Abstract',
          ShortName: 'Mock ShortName'
        }
      })

    const response = await collectionDraftDatasource({
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
      abstract: 'Mock Abstract',
      shortName: 'Mock ShortName'
    }])
  })

  test('catches errors received from mmtQuery', async () => {
    nock(/example/)
      .get(/api\/drafts/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      collectionDraftDatasource({
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
