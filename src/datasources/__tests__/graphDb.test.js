import nock from 'nock'

import graphDbDatasource from '../graphDb'

import relatedCollectionsGraphdbResponseMocks from './__mocks__/relatedCollections.graphdbResponse.mocks'
import relatedCollectionsResponseMocks from './__mocks__/relatedCollections.response.mocks'

describe('graphDb', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('relatedCollections with parameters', () => {
    test('returns the graphDb', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/graphdb/)
        .reply(200, relatedCollectionsGraphdbResponseMocks)

      const response = await graphDbDatasource(
        'C1200400842-GHRC',
        {
          limit: 5
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      )

      expect(response).toEqual(relatedCollectionsResponseMocks)
    })
  })

  test('catches errors received from queryCmrTools', async () => {
    nock(/example/)
      .post(/tools/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      graphDbDatasource(
        'C1200400842-GHRC',
        'acquiredWith',
        {
          platform: 'METEOSAT-7',
          instrument: 'VISSR'
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        'value'
      )
    ).rejects.toThrow(Error)
  })
})
