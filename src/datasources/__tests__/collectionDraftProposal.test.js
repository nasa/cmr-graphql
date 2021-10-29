import nock from 'nock'

import collectionDraftProposalDatasource from '../collectionDraftProposal'

let requestInfo

describe('collectionDraftProposal', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.draftMmtRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'collectionDraftProposal',
      alias: 'collectionDraftProposal',
      args: {},
      fieldsByTypeName: {
        CollectionDraftProposal: {
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

  test('returns the collection draft proposal results', async () => {
    nock(/example/)
      .defaultReplyHeaders({
        'X-Request-Id': 'abcd-1234-efgh-5678'
      })
      .get(/collection_draft_proposals/)
      .reply(200, {
        Abstract: 'Mock Abstract',
        ShortName: 'Mock ShortName'
      })

    const response = await collectionDraftProposalDatasource({ id: '123' }, { 'X-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collectionDraftProposal')

    expect(response).toEqual([{
      abstract: 'Mock Abstract',
      shortName: 'Mock ShortName'
    }])
  })

  test('catches errors received from draftMmtQuery', async () => {
    nock(/example/)
      .get(/collection_draft_proposals/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      collectionDraftProposalDatasource({ id: '123' }, { 'X-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collectionDraftProposal')
    ).rejects.toThrow(Error)
  })
})
