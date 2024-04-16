import nock from 'nock'
import DataLoader from 'dataloader'

import { buildContextValue, server } from './__mocks__/mockServer'

import { getCollectionsById } from '../../dataloaders/getCollectionsById'

const contextValue = buildContextValue({
  collectionLoader: new DataLoader(getCollectionsById, { cacheKeyFn: (obj) => obj.conceptId })
})

describe('Granule', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all granule fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/granules.json?page_size=20&collection_concept_id=C100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              boxes: [],
              browse_flag: false,
              cloud_cover: 25,
              collection_concept_id: 'C100000-EDSC',
              coordinate_system: 'CARTESIAN',
              data_center: 'Tortor Lorem',
              dataset_id: 'Condimentum Ullamcorper Malesuada Sollicitudin',
              day_night_flag: 'BOTH',
              granule_size: 525.0454,
              id: 'G100000-EDSC',
              links: [],
              online_access_flag: true,
              original_format: 'Elit',
              points: [],
              producer_granule_id: 'ornare-cursus-ultricies-nibh',
              time_end: '2016-04-04T08:00:00.000Z',
              time_start: '2016-04-04T17:00:00.000Z',
              title: 'Condimentum Ullamcorper Malesuada Sollicitudin',
              updated: '2016-04-04T20:00:00.000Z'
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/granules.umm_json?page_size=20&collection_concept_id=C100000-EDSC')
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC',
              'native-id': 'test-guid'
            },
            umm: {
              CloudCover: 25,
              DataGranule: {},
              GranuleUR: 'parturient-etiam-malesuada',
              MeasuredParameters: {},
              OrbitCalculatedSpatialDomains: {},
              ProviderDates: {},
              RelatedUrls: [],
              SpatialExtent: {},
              TemporalExtent: {}
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          granules(params: { collectionConceptId: "C100000-EDSC" }) {
            count
            items {
              boxes
              browseFlag
              cloudCover
              collectionConceptId
              conceptId
              coordinateSystem
              dataCenter
              dataGranule
              datasetId
              dayNightFlag
              granuleSize
              granuleUr
              links
              measuredParameters
              nativeId
              onlineAccessFlag
              orbitCalculatedSpatialDomains
              originalFormat
              points
              producerGranuleId
              providerDates
              relatedUrls
              spatialExtent
              temporalExtent
              timeEnd
              timeStart
              title
              updated
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        granules: {
          count: 1,
          items: [{
            boxes: [],
            browseFlag: false,
            collectionConceptId: 'C100000-EDSC',
            cloudCover: 25,
            conceptId: 'G100000-EDSC',
            coordinateSystem: 'CARTESIAN',
            dataCenter: 'Tortor Lorem',
            dataGranule: {},
            datasetId: 'Condimentum Ullamcorper Malesuada Sollicitudin',
            dayNightFlag: 'BOTH',
            granuleSize: 525.0454,
            granuleUr: 'parturient-etiam-malesuada',
            links: [],
            measuredParameters: {},
            nativeId: 'test-guid',
            onlineAccessFlag: true,
            orbitCalculatedSpatialDomains: {},
            originalFormat: 'Elit',
            points: [],
            producerGranuleId: 'ornare-cursus-ultricies-nibh',
            providerDates: {},
            relatedUrls: [],
            spatialExtent: {},
            temporalExtent: {},
            timeEnd: '2016-04-04T08:00:00.000Z',
            timeStart: '2016-04-04T17:00:00.000Z',
            title: 'Condimentum Ullamcorper Malesuada Sollicitudin',
            updated: '2016-04-04T20:00:00.000Z'
          }]
        }
      })
    })

    test('granules', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/granules.json?page_size=2')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }, {
              id: 'G100001-EDSC'
            }]
          }
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          granules(params: { limit:2 }) {
            items {
              conceptId
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        granules: {
          items: [{
            conceptId: 'G100000-EDSC'
          }, {
            conceptId: 'G100001-EDSC'
          }]
        }
      })
    })

    describe('granule', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/granules.json?concept_id=G100000-EDSC')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G100000-EDSC'
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              granule(params: { conceptId: "G100000-EDSC" }) {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            granule: {
              conceptId: 'G100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/granules.json?concept_id=G100000-EDSC')
            .reply(200, {
              feed: {
                entry: []
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              granule(params: { conceptId: "G100000-EDSC" }) {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            granule: null
          })
        })
      })
    })
  })

  describe('Granule', () => {
    test('collection', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/granules\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G1000-TEST',
              collection_concept_id: 'C1000-TEST'
            }, {
              id: 'G1001-TEST',
              collection_concept_id: 'C1000-TEST'
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C1000-TEST'
            }]
          }
        })

      const response = await server.executeOperation({
        variables: {
          conceptId: 'G1000-TEST'
        },
        query: `{
          granule {
            collection {
              conceptId
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        granule: {
          collection: {
            conceptId: 'C1000-TEST'
          }
        }
      })
    })
  })
})
