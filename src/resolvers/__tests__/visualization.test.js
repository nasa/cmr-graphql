import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Visualization', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all visualization fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/visualizations\.json/)
        .reply(200, {
          hits: 1,
          took: 9,
          items: [
            {
              concept_id: 'VIS100000-EDSC',
              revision_id: 3,
              provider_id: 'EDSC',
              native_id: 'tiles',
              name: 'MODIS_Terra_Corrected_Reflectance_TrueColor',
              id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
              associations: {},
              association_details: {}
            }
          ]
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/visualizations\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'revision-id': 3,
              deleted: false,
              'provider-id': 'EDSC',
              'user-id': 'ECHO_SYS',
              associations: {},
              'native-id': 'tiles',
              'association-details': {},
              'concept-id': 'VIS100000-EDSC',
              'revision-date': '2025-03-18VIS19:22:44.814Z',
              'concept-type': 'visualization'
            },
            umm: {
              ConceptIds: [
                {
                  Type: 'STD',
                  Value: 'C1000000001-EARTHDATA',
                  DataCenter: 'MODAPS',
                  ShortName: 'MODIS_Terra_CorrectedReflectance',
                  Title: 'MODIS/Terra Corrected Reflectance True Color',
                  Version: '6.1'
                }
              ],
              SpatialExtent: {
                GranuleSpatialRepresentation: 'GEODETIC',
                HorizontalSpatialDomain: {
                  Geometry: {
                    CoordinateSystem: 'GEODETIC',
                    BoundingRectangles: [
                      {
                        WestBoundingCoordinate: -180,
                        NorthBoundingCoordinate: 90,
                        EastBoundingCoordinate: 180,
                        SouthBoundingCoordinate: -90
                      }
                    ]
                  }
                }
              },
              VisualizationType: 'tiles',
              Title: 'FOO UPDATE MODIS Terra Corrected Reflectance (True Color)',
              ScienceKeywords: [
                {
                  Category: 'EARTH SCIENCE',
                  Topic: 'SPECTRAL/ENGINEERING',
                  Term: 'VISIBLE WAVELENGTHS',
                  VariableLevel1: 'REFLECTANCE'
                },
                {
                  Category: 'EARTH SCIENCE',
                  Topic: 'ATMOSPHERIC OPTICS',
                  Term: 'ATMOSPHERIC TRANSMITTANCE',
                  VariableLevel1: 'ATMOSPHERIC TRANSPARENCY'
                }
              ],
              TemporalExtents: [
                {
                  RangeDateTimes: [
                    {
                      BeginningDateTime: '2002-05-01T00:00:00Z',
                      EndingDateTime: '2023-12-31T23:59:59Z'
                    }
                  ],
                  EndsAtPresentFlag: true
                }
              ],
              Specification: {
                ProductIdentification: {
                  InternalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  StandardOrNRTExternalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  BestAvailableExternalIdentifier: 'MODIS_Terra_CorrectedReflectance',
                  GIBSTitle: 'Corrected Reflectance (True Color)',
                  WorldviewTitle: 'Corrected Reflectance (True Color)',
                  WorldviewSubtitle: 'Terra / MODIS'
                },
                ProductMetadata: {
                  ParameterUnits: [
                    null
                  ],
                  InternalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  SourceDatasets: [
                    'C1000000001-EARTHDATA'
                  ],
                  TemporalCoverage: '2002-05-01/P1D',
                  RepresentingDatasets: [
                    'C1000000001-EARTHDATA'
                  ],
                  'wmts:Dimension': {
                    Identifier: 'Time',
                    UOM: 'ISO8601',
                    Default: '2023-12-31',
                    Current: true,
                    Value: [
                      '2002-05-01/2023-12-31/P1D'
                    ]
                  },
                  OrbitDirection: [
                    'descending'
                  ],
                  Measurement: 'Corrected Reflectance',
                  ScienceParameters: [
                    'reflectance'
                  ],
                  AscendingOrDescending: 'Both',
                  Daynight: [
                    'day'
                  ],
                  NativeSpatialCoverage: [
                    -90,
                    -180,
                    90,
                    180
                  ],
                  'wmts:Format': [
                    'image/jpeg'
                  ],
                  UpdateInterval: 180,
                  OrbitTracks: [
                    'OrbitTracks_Terra_Descending'
                  ],
                  LayerPeriod: 'Daily',
                  Ongoing: true,
                  'ows:Metadata': [
                    {
                      'xlink:Href': 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Corrected_Reflectance_TrueColor.xml',
                      'xlink:Role': 'http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3',
                      'xlink:Title': 'GIBS Color Map: Data - RGB Mapping',
                      'xlink:Type': 'simple'
                    }
                  ],
                  'ows:Identifier': 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  WGS84SpatialCoverage: [
                    -90,
                    -180,
                    90,
                    180
                  ],
                  GranuleOrComposite: 'Granule',
                  ColorMap: 'MODIS_Corrected_Reflectance_TrueColor',
                  DataDayBreak: '00:00:00Z',
                  VisualizationLatency: '4 hours',
                  'wmts:TileMatrixSetLink': {
                    TileMatrixSet: '250m'
                  },
                  RetentionPeriod: 365
                }
              },
              Generation: {
                SourceProjection: 'EPSG:4326',
                SourceResolution: 'Native',
                SourceFormat: 'GeoTIFF',
                SourceColorModel: 'Full-Color RGB',
                SourceCoverage: 'Granule',
                OutputProjection: 'EPSG:4326',
                OutputResolution: '250m',
                OutputFormat: 'JPEG'
              },
              Description: 'MODIS Terra Corrected Reflectance True Color imagery shows land surface, ocean and atmospheric features by combining three different channels (bands) of the sensor data. The image has been enhanced through processing, including atmospheric correction for aerosols, to improve the visual depiction of the land surface while maintaining realistic colors.',
              Subtitle: 'Terra / MODIS',
              Name: 'MODIS_Terra_Corrected_Reflectance_TrueColor',
              Identifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
              MetadataSpecification: {
                URL: 'https://cdn.earthdata.nasa.gov/umm/visualization/v1.1.0',
                Name: 'Visualization',
                Version: '1.1.0'
              }
            }
          }]
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 2,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/visualizations.umm_json?all_revisions=true&concept_id=VIS100000-EDSC')
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'VIS100000-EDSC',
              'native-id': 'test-guid',
              'revision-id': '2'
            },
            umm: {
              Name: 'Cras mattis consectetur purus sit amet fermentum.'
            }
          }, {
            meta: {
              'concept-id': 'VIS100000-EDSC',
              'native-id': 'test-guid',
              'revision-id': '1'
            },
            umm: {
              Name: 'Cras mattis consectetur purus sit amet fermentum.'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          visualizations {
            count
            items {
              conceptId
              description
              generation
              identifier
              metadataSpecification
              name
              nativeId
              revisionDate
              revisionId
              revisions {
                count
                items {
                  revisionId
                }
              }
              scienceKeywords
              spatialExtent
              specification
              subtitle
              temporalExtent
              title
              ummMetadata
              visualizationType
              collections {
                count
              }
            }
          }
        }`
      }, {
        contextValue
      })

      const { data, errors } = response.body.singleResult

      expect(errors).toBeUndefined()

      expect(data).toEqual({
        visualizations: {
          count: 1,
          items: [{
            conceptId: 'VIS100000-EDSC',
            description: 'MODIS Terra Corrected Reflectance True Color imagery shows land surface, ocean and atmospheric features by combining three different channels (bands) of the sensor data. The image has been enhanced through processing, including atmospheric correction for aerosols, to improve the visual depiction of the land surface while maintaining realistic colors.',
            generation: {
              sourceProjection: 'EPSG:4326',
              sourceResolution: 'Native',
              sourceFormat: 'GeoTIFF',
              sourceColorModel: 'Full-Color RGB',
              sourceCoverage: 'Granule',
              outputProjection: 'EPSG:4326',
              outputResolution: '250m',
              outputFormat: 'JPEG'
            },
            identifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
            metadataSpecification: {
              url: 'https://cdn.earthdata.nasa.gov/umm/visualization/v1.1.0',
              name: 'Visualization',
              version: '1.1.0'
            },
            name: 'MODIS_Terra_Corrected_Reflectance_TrueColor',
            nativeId: 'tiles',
            revisionDate: '2025-03-18VIS19:22:44.814Z',
            revisionId: '3',
            revisions: {
              count: 2,
              items: [{ revisionId: '2' }, { revisionId: '1' }]
            },
            scienceKeywords: null,
            spatialExtent: {
              granuleSpatialRepresentation: 'GEODETIC',
              horizontalSpatialDomain: {
                geometry: {
                  coordinateSystem: 'GEODETIC',
                  boundingRectangles: [{
                    westBoundingCoordinate: -180,
                    northBoundingCoordinate: 90,
                    eastBoundingCoordinate: 180,
                    southBoundingCoordinate: -90
                  }]
                }
              }
            },
            specification: {
              productIdentification: {
                internalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                standardOrNrtExternalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                bestAvailableExternalIdentifier: 'MODIS_Terra_CorrectedReflectance',
                gibsTitle: 'Corrected Reflectance (True Color)',
                worldviewTitle: 'Corrected Reflectance (True Color)',
                worldviewSubtitle: 'Terra / MODIS'
              },
              productMetadata: {
                parameterUnits: [null],
                internalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                sourceDatasets: ['C1000000001-EARTHDATA'],
                temporalCoverage: '2002-05-01/P1D',
                representingDatasets: ['C1000000001-EARTHDATA'],
                'wmts:dimension': {
                  identifier: 'Time',
                  uom: 'ISO8601',
                  default: '2023-12-31',
                  current: true,
                  value: ['2002-05-01/2023-12-31/P1D']
                },
                orbitDirection: ['descending'],
                measurement: 'Corrected Reflectance',
                scienceParameters: ['reflectance'],
                ascendingOrDescending: 'Both',
                daynight: ['day'],
                nativeSpatialCoverage: [-90, -180, 90, 180],
                'wmts:format': ['image/jpeg'],
                updateInterval: 180,
                orbitTracks: ['OrbitTracks_Terra_Descending'],
                layerPeriod: 'Daily',
                ongoing: true,
                'ows:metadata': [{
                  'xlink:href': 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Corrected_Reflectance_TrueColor.xml',
                  'xlink:role': 'http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3',
                  'xlink:title': 'GIBS Color Map: Data - RGB Mapping',
                  'xlink:type': 'simple'
                }],
                'ows:identifier': 'MODIS_Terra_CorrectedReflectance_TrueColor',
                wgs84SpatialCoverage: [-90, -180, 90, 180],
                granuleOrComposite: 'Granule',
                colorMap: 'MODIS_Corrected_Reflectance_TrueColor',
                dataDayBreak: '00:00:00Z',
                visualizationLatency: '4 hours',
                'wmts:tileMatrixSetLink': { tileMatrixSet: '250m' },
                retentionPeriod: 365
              }
            },
            subtitle: 'Terra / MODIS',
            temporalExtent: null,
            title: 'FOO UPDATE MODIS Terra Corrected Reflectance (True Color)',
            ummMetadata: {
              ConceptIds: [{
                Type: 'STD',
                Value: 'C1000000001-EARTHDATA',
                DataCenter: 'MODAPS',
                ShortName: 'MODIS_Terra_CorrectedReflectance',
                Title: 'MODIS/Terra Corrected Reflectance True Color',
                Version: '6.1'
              }],
              SpatialExtent: {
                GranuleSpatialRepresentation: 'GEODETIC',
                HorizontalSpatialDomain: {
                  Geometry: {
                    CoordinateSystem: 'GEODETIC',
                    BoundingRectangles: [{
                      WestBoundingCoordinate: -180,
                      NorthBoundingCoordinate: 90,
                      EastBoundingCoordinate: 180,
                      SouthBoundingCoordinate: -90
                    }]
                  }
                }
              },
              VisualizationType: 'tiles',
              Title: 'FOO UPDATE MODIS Terra Corrected Reflectance (True Color)',
              ScienceKeywords: [{
                Category: 'EARTH SCIENCE',
                Topic: 'SPECTRAL/ENGINEERING',
                Term: 'VISIBLE WAVELENGTHS',
                VariableLevel1: 'REFLECTANCE'
              }, {
                Category: 'EARTH SCIENCE',
                Topic: 'ATMOSPHERIC OPTICS',
                Term: 'ATMOSPHERIC TRANSMITTANCE',
                VariableLevel1: 'ATMOSPHERIC TRANSPARENCY'
              }],
              TemporalExtents: [{
                RangeDateTimes: [{
                  BeginningDateTime: '2002-05-01T00:00:00Z',
                  EndingDateTime: '2023-12-31T23:59:59Z'
                }],
                EndsAtPresentFlag: true
              }],
              Specification: {
                ProductIdentification: {
                  InternalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  StandardOrNRTExternalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  BestAvailableExternalIdentifier: 'MODIS_Terra_CorrectedReflectance',
                  GIBSTitle: 'Corrected Reflectance (True Color)',
                  WorldviewTitle: 'Corrected Reflectance (True Color)',
                  WorldviewSubtitle: 'Terra / MODIS'
                },
                ProductMetadata: {
                  ParameterUnits: [null],
                  InternalIdentifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  SourceDatasets: ['C1000000001-EARTHDATA'],
                  TemporalCoverage: '2002-05-01/P1D',
                  RepresentingDatasets: ['C1000000001-EARTHDATA'],
                  'wmts:Dimension': {
                    Identifier: 'Time',
                    UOM: 'ISO8601',
                    Default: '2023-12-31',
                    Current: true,
                    Value: ['2002-05-01/2023-12-31/P1D']
                  },
                  OrbitDirection: ['descending'],
                  Measurement: 'Corrected Reflectance',
                  ScienceParameters: ['reflectance'],
                  AscendingOrDescending: 'Both',
                  Daynight: ['day'],
                  NativeSpatialCoverage: [-90, -180, 90, 180],
                  'wmts:Format': ['image/jpeg'],
                  UpdateInterval: 180,
                  OrbitTracks: ['OrbitTracks_Terra_Descending'],
                  LayerPeriod: 'Daily',
                  Ongoing: true,
                  'ows:Metadata': [{
                    'xlink:Href': 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/MODIS_Corrected_Reflectance_TrueColor.xml',
                    'xlink:Role': 'http://earthdata.nasa.gov/gibs/metadata-type/colormap/1.3',
                    'xlink:Title': 'GIBS Color Map: Data - RGB Mapping',
                    'xlink:Type': 'simple'
                  }],
                  'ows:Identifier': 'MODIS_Terra_CorrectedReflectance_TrueColor',
                  WGS84SpatialCoverage: [-90, -180, 90, 180],
                  GranuleOrComposite: 'Granule',
                  ColorMap: 'MODIS_Corrected_Reflectance_TrueColor',
                  DataDayBreak: '00:00:00Z',
                  VisualizationLatency: '4 hours',
                  'wmts:TileMatrixSetLink': { TileMatrixSet: '250m' },
                  RetentionPeriod: 365
                }
              },
              Generation: {
                SourceProjection: 'EPSG:4326',
                SourceResolution: 'Native',
                SourceFormat: 'GeoTIFF',
                SourceColorModel: 'Full-Color RGB',
                SourceCoverage: 'Granule',
                OutputProjection: 'EPSG:4326',
                OutputResolution: '250m',
                OutputFormat: 'JPEG'
              },
              Description: 'MODIS Terra Corrected Reflectance True Color imagery shows land surface, ocean and atmospheric features by combining three different channels (bands) of the sensor data. The image has been enhanced through processing, including atmospheric correction for aerosols, to improve the visual depiction of the land surface while maintaining realistic colors.',
              Subtitle: 'Terra / MODIS',
              Name: 'MODIS_Terra_Corrected_Reflectance_TrueColor',
              Identifier: 'MODIS_Terra_CorrectedReflectance_TrueColor',
              MetadataSpecification: {
                URL: 'https://cdn.earthdata.nasa.gov/umm/visualization/v1.1.0',
                Name: 'Visualization',
                Version: '1.1.0'
              }
            },
            visualizationType: 'tiles',
            collections: {
              count: 0
            }
          }]
        }
      })
    })

    test('visualizations', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/visualizations.json?page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'VIS100000-EDSC'
          }, {
            concept_id: 'VIS100001-EDSC'
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          visualizations (params: { limit:2 }) {
            items {
              conceptId
            }
          }
        }`
      }, {
        contextValue
      })

      const { data, errors } = response.body.singleResult

      expect(errors).toBeUndefined()

      expect(data).toEqual({
        visualizations: {
          items: [{
            conceptId: 'VIS100000-EDSC'
          }, {
            conceptId: 'VIS100001-EDSC'
          }]
        }
      })
    })

    describe('visualization', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/visualizations.json?concept_id=VIS100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'VIS100000-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              visualization (params: { conceptId: "VIS100000-EDSC" }) {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            visualization: {
              conceptId: 'VIS100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/visualizations.json?concept_id=VIS100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              visualization (params: { conceptId: "VIS100000-EDSC" }) {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            visualization: null
          })
        })
      })
    })
  })

  describe('Mutation', () => {
    describe('restoreVisualizationRevision', () => {
      test('restores an old version of a visualization', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/visualizations.umm_json?concept_id=VIS100000-EDSC&all_revisions=true')
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'VIS100000-EDSC',
                'native-id': '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
                'revision-id': 1
              },
              umm: {
                EntryTitle: 'Tortor Elit Fusce Quam Risus'
              }
            }, {
              meta: {
                'concept-id': 'VIS100000-EDSC',
                'native-id': '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
                'revision-id': 2
              },
              umm: {
                EntryTitle: 'Adipiscing Cras Etiam Venenatis'
              }
            }]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .put('/ingest/providers/EDSC/visualizations/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')
          .reply(200, {
            'concept-id': 'VIS100000-EDSC',
            'revision-id': '3'
          })

        const response = await server.executeOperation({
          variables: {
            revisionId: '1',
            conceptId: 'VIS100000-EDSC'
          },
          query: `mutation RestoreVisualizationRevision (
              $conceptId: String!
              $revisionId: String!
            ) {
              restoreVisualizationRevision (
                conceptId: $conceptId
                revisionId: $revisionId
              ) {
                  conceptId
                  revisionId
                }
              }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          restoreVisualizationRevision: {
            conceptId: 'VIS100000-EDSC',
            revisionId: '3'
          }
        })
      })
    })

    test('deleteVisualization', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .delete(/ingest\/providers\/EDSC\/visualizations\/test-guid/)
        .reply(201, {
          'concept-id': 'VIS100000-EDSC',
          'revision-id': '2'
        })

      const response = await server.executeOperation({
        variables: {
          nativeId: 'test-guid',
          providerId: 'EDSC'
        },
        query: `mutation DeleteVisualization (
          $providerId: String!
          $nativeId: String!
        ) {
          deleteVisualization (
            providerId: $providerId
            nativeId: $nativeId
          ) {
              conceptId
              revisionId
            }
          }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        deleteVisualization: {
          conceptId: 'VIS100000-EDSC',
          revisionId: '2'
        }
      })
    })
  })

  describe('Visualization', () => {
    describe('collections', () => {
      test('returns collections when querying a published record', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/visualizations\.json/)
          .reply(200, {
            items: [{
              concept_id: 'VIS100000-EDSC',
              association_details: {
                collections: [
                  {
                    data: {
                      association_type: 'visualization'
                    },
                    concept_id: 'C100000-EDSC'
                  }
                ]
              }
            }, {
              concept_id: 'VIS100001-EDSC',
              association_details: {
                collections: [
                  {
                    data: {
                      association_type: 'visualization'
                    },
                    concept_id: 'C100001-EDSC'
                  }
                ]
              }
            }]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/collections.json?concept_id[]=C100000-EDSC&page_size=20')
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100000-EDSC'
              }]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/collections.json?concept_id[]=C100001-EDSC&page_size=20')
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100001-EDSC'
              }]
            }
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            visualizations {
              items {
                conceptId
                collections {
                  items {
                    conceptId
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(data).toEqual({
          visualizations: {
            items: [{
              conceptId: 'VIS100000-EDSC',
              collections: {
                items: [{
                  conceptId: 'C100000-EDSC'
                }]
              }
            }, {
              conceptId: 'VIS100001-EDSC',
              collections: {
                items: [{
                  conceptId: 'C100001-EDSC'
                }]
              }
            }]
          }
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/visualization-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'VISD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'VISD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Visualization'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Visualization {
                    collections {
                      count
                    }
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                collections: null
              }
            }, {
              previewMetadata: {
                collections: null
              }
            }]
          }
        })
      })
    })
  })
})
