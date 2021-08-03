import nock from 'nock'

import graphDbDatasource from '../graphDb'

import documentedWithByCollectionResponseMocks from './__mocks__/documentedWith/byCollection.response.mocks'
import documentedWithByValueResponseMocks from './__mocks__/documentedWith/byValue.response.mocks'
import documentedWithGraphdbResponseMocks from './__mocks__/documentedWith/graphdbResponse.mocks'
import campaignedWithByCollectionResponseMocks from './__mocks__/campaignedWith/byCollection.response.mocks'
import campaignedWithByValueResponseMocks from './__mocks__/campaignedWith/byValue.response.mocks'
import campaignedWithGraphdbResponseMocks from './__mocks__/campaignedWith/graphdbResponse.mocks'
import acquiredWithByCollectionResponseMocks from './__mocks__/acquiredWith/byCollection.response.mocks'
import acquiredWithByValueResponseMocks from './__mocks__/acquiredWith/byValue.response.mocks'
import acquiredWithGraphdbResponseMocks from './__mocks__/acquiredWith/graphdbResponse.mocks'

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

  describe('documentedWith with parameters', () => {
    describe('grouped by collection', () => {
      test('returns the graphDb', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, documentedWithGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          'documentedWith',
          {
            name: 'http://ghrc.nsstc.nasa.gov/uso/ds_docs/globalir/globalir_dataset.html',
            title: 'USER\'S GUIDE'
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          'collection'
        )

        expect(response).toEqual(documentedWithByCollectionResponseMocks)
      })
    })

    describe('grouped by value', () => {
      test('returns the graphDb', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, documentedWithGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          'documentedWith',
          {
            name: 'http://ghrc.nsstc.nasa.gov/uso/ds_docs/globalir/globalir_dataset.html',
            title: 'USER\'S GUIDE'
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          'value'
        )

        expect(response).toEqual(documentedWithByValueResponseMocks)
      })
    })
  })

  describe('campaignedWith with parameters', () => {
    describe('grouped by collection', () => {
      test('returns the graphDb', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, campaignedWithGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          'campaignedWith',
          {
            name: 'Project1'
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          'collection'
        )

        expect(response).toEqual(campaignedWithByCollectionResponseMocks)
      })
    })

    describe('grouped by value', () => {
      test('returns the graphDb', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, campaignedWithGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          'campaignedWith',
          {
            name: 'Project1'
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          'value'
        )

        expect(response).toEqual(campaignedWithByValueResponseMocks)
      })
    })
  })

  describe('acquiredWith with parameters', () => {
    describe('grouped by collection', () => {
      test('returns the graphDb', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, acquiredWithGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          'acquiredWith',
          {
            platform: 'METEOSAT-7',
            instrument: 'VISSR'
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          'collection'
        )

        expect(response).toEqual(acquiredWithByCollectionResponseMocks)
      })
    })

    describe('grouped by value', () => {
      test('returns the graphDb', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/)
          .reply(200, acquiredWithGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          'acquiredWith',
          {
            platform: 'METEOSAT-7',
            instrument: 'VISSR'
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          'value'
        )

        expect(response).toEqual(acquiredWithByValueResponseMocks)
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
