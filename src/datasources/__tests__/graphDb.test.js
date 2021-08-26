import nock from 'nock'

import graphDbDatasource from '../graphDb'

import relatedCollectionsRelatedUrlTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlType.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlTypeResponseMocks from './__mocks__/relatedCollections.relatedUrlType.response.mocks'
import relatedCollectionsRelatedUrlSubTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlSubType.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlSubTypeResponseMocks from './__mocks__/relatedCollections.relatedUrlSubType.response.mocks'
import relatedCollectionsRelatedUrlTypeAndSubTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlTypeAndSubType.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlTypeAndSubTypeResponseMocks from './__mocks__/relatedCollections.relatedUrlTypeAndSubType.response.mocks'

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
    describe('When the relatedUrlType parameter is used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, relatedCollectionsRelatedUrlTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlTypeResponseMocks)
      })
    })

    describe('When the relatedUrlSubType parameter is used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, relatedCollectionsRelatedUrlSubTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlSubType: ["USER'S GUIDE"]
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlSubTypeResponseMocks)
      })
    })

    describe('When the relatedUrlType and relatedUrlSubType parameters are used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, relatedCollectionsRelatedUrlTypeAndSubTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION'],
            relatedUrlSubType: ["USER'S GUIDE"]
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlTypeAndSubTypeResponseMocks)
      })
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
