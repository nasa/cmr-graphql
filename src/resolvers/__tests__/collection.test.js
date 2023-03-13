import nock from 'nock'

import resolvers from '..'
import {
  buildContextValue,
  server
} from './__mocks__/mockServer'

import duplicateCollectionsGraphdbResponseMocks from './__mocks__/duplicateCollections.graphdbResponse.mocks'
import duplicateCollectionsResponseMocks from './__mocks__/duplicateCollections.response.mocks'
import relatedCollectionsGraphdbResponseMocks from './__mocks__/relatedCollections.graphdbResponse.mocks'
import relatedCollectionsResponseMocks from './__mocks__/relatedCollections.response.mocks'

const contextValue = buildContextValue()

describe('Collection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
    process.env.graphdbHost = 'http://example-graphdb.com'
    process.env.graphdbPort = '8182'
    process.env.graphdbPath = ''
    process.env.ursRootUrl = 'http://example-urs.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all collection fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              archive_center: 'CONDIMENTUM/TELLUS/PHARETRA',
              association_details: {
                variables: [
                  {
                    data: '{"XYZ": "XYZ", "allow-regridding": true}',
                    'concept-id': 'V100000-EDSC'
                  }
                ]
              },
              boxes: [],
              browse_flag: true,
              cloud_hosted: false,
              consortiums: ['GEOSS'],
              coordinate_system: 'CARTESIAN',
              data_center: 'PORTA',
              dataset_id: 'Condimentum Quam Mattis Cursus Pharetra',
              has_formats: true,
              has_granules: true,
              has_spatial_subsetting: true,
              has_temporal_subsetting: true,
              has_transforms: true,
              has_variables: true,
              id: 'C100000-EDSC',
              lines: [],
              online_access_flag: true,
              organizations: [],
              original_format: 'RISUS',
              platforms: [],
              processing_level_id: 'Not Provided',
              points: [],
              polygons: [],
              short_name: 'LOREM-QUAM',
              summary: 'Cras mattis consectetur purus sit amet fermentum.',
              tags: {},
              time_end: '2016-04-04T08:00:00.000Z',
              time_start: '2016-04-04T17:00:00.000Z',
              title: 'Condimentum Quam Mattis Cursus Pharetra',
              version_id: '1.0.0'
            }],
            facets: {
              title: 'Browse Collections',
              type: 'group',
              has_children: true,
              children: [
                {
                  title: 'Keywords',
                  type: 'group',
                  applied: false,
                  has_children: true,
                  children: [
                    {
                      title: 'Aerosols',
                      type: 'filter',
                      applied: false,
                      count: 1,
                      links: {
                        apply: 'http://example.com:443/search/collections.json?include_facets=v2&science_keywords_h%5B0%5D%5Btopic%5D=Aerosols'
                      },
                      has_children: true
                    }
                  ]
                }
              ]
            }
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC',
              'native-id': 'test-guid',
              'association-details': {
                variables: [
                  {
                    data: '{"XYZ": "XYZ", "allow-regridding": true}',
                    'concept-id': 'V100000-EDSC'
                  }
                ]
              }
            },
            umm: {
              Abstract: 'Cras mattis consectetur purus sit amet fermentum.',
              AccessConstraints: [],
              AdditionalAttributes: [],
              AncillaryKeywords: [],
              ArchiveAndDistributionInformation: {
                FileDistributionInformation: [
                  {
                    FormatType: 'Native',
                    Fees: 'Free',
                    Format: 'ASCII',
                    Media: ['FTP']
                  }, {
                    Format: 'UNSPECIFIED'
                  }
                ]
              },
              AssociatedDOIs: [{
                DOI: '10.1234/ParentDOIID1',
                Title: 'DOI Title 1',
                Authority: 'https://doi.org/'
              },
              {
                DOI: '10.1234/ParentDOIID2',
                Title: 'DOI Title 2',
                Authority: 'https://doi.org/'
              }],
              CollectionCitations: [],
              CollectionProgress: 'ACTIVE',
              ContactGroups: [],
              ContactPersons: [],
              DataCenters: [],
              DataDates: [],
              DataLanguage: 'English',
              DirectDistributionInformation: {
                region: 'us-east-2',
                s3BucketAndObjectPrefixNames: ['TestBucketOrObjectPrefix'],
                s3CredentialsApiEndpoint: 'https://DAACCredentialEndpoint.org',
                s3CredentialsApiDocumentationUrl: 'https://DAACCredentialDocumentation.org'
              },
              DirectoryNames: [],
              DOI: {},
              ISOTopicCategories: [],
              LocationKeywords: [],
              MetadataAssociations: [],
              MetadataDates: [],
              MetadataLanguage: 'English',
              PaleoTemporalCoverages: [],
              Platforms: [{
                Type: 'Not Specified',
                ShortName: 'AQUA',
                LongName: 'Earth Observing System, AQUA',
                Instruments: [
                  {
                    ShortName: 'AIRS',
                    LongName: 'Atmospheric Infrared Sounder',
                    ComposedOf: [
                      {
                        ShortName: 'AIRS',
                        LongName: 'Atmospheric Infrared Sounder'
                      }
                    ]
                  }
                ]
              }],
              ProcessingLevel: {
                Id: 'Not Provided'
              },
              Projects: [],
              PublicationReferences: [],
              Purpose: 'Mock Purpose',
              Quality: 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
              RelatedUrls: [],
              ScienceKeywords: [],
              SpatialExtent: {},
              SpatialInformation: {},
              StandardProduct: true,
              TemporalExtents: [],
              TemporalKeywords: [],
              TilingIdentificationSystems: {},
              UseConstraints: [],
              EntryTitle: 'Condimentum Quam Mattis Cursus Pharetra',
              VersionDescription: 'The description of the version',
              Version: '1.0.0',
              VersionId: '1.0.0'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          collections {
            count
            facets
            items {
              abstract
              accessConstraints
              additionalAttributes
              ancillaryKeywords
              archiveAndDistributionInformation
              archiveCenter
              associationDetails
              associatedDois
              boxes
              browseFlag
              cloudHosted
              collectionCitations
              collectionProgress
              conceptId
              consortiums
              contactGroups
              contactPersons
              coordinateSystem
              dataCenter
              dataCenters
              dataDates
              dataLanguage
              datasetId
              directDistributionInformation
              directoryNames
              doi
              hasFormats
              hasGranules
              hasSpatialSubsetting
              hasTemporalSubsetting
              hasTransforms
              hasVariables
              isoTopicCategories
              lines
              locationKeywords
              metadataAssociations
              metadataDates
              metadataFormat
              metadataLanguage
              nativeDataFormats
              nativeId
              onlineAccessFlag
              organizations
              originalFormat
              paleoTemporalCoverages
              platforms
              points
              polygons
              processingLevel
              processingLevelId
              projects
              provider
              publicationReferences
              purpose
              quality
              relatedUrls
              scienceKeywords
              shortName
              spatialExtent
              spatialInformation
              standardProduct
              tags
              temporalExtents
              temporalKeywords
              tilingIdentificationSystems
              timeEnd
              timeStart
              title
              useConstraints
              version
              versionDescription
              versionId
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        collections: {
          count: 1,
          facets: {
            children: [
              {
                applied: false,
                children: [
                  {
                    applied: false,
                    count: 1,
                    hasChildren: true,
                    links: {
                      apply: 'http://example.com:443/search/collections.json?include_facets=v2&science_keywords_h%5B0%5D%5Btopic%5D=Aerosols'
                    },
                    title: 'Aerosols',
                    type: 'filter'
                  }
                ],
                hasChildren: true,
                title: 'Keywords',
                type: 'group'
              }
            ],
            hasChildren: true,
            title: 'Browse Collections',
            type: 'group'
          },
          items: [{
            associationDetails: {
              variables: [
                {
                  data: '{"XYZ": "XYZ", "allow-regridding": true}',
                  conceptId: 'V100000-EDSC'
                }]
            },
            abstract: 'Cras mattis consectetur purus sit amet fermentum.',
            accessConstraints: [],
            additionalAttributes: [],
            ancillaryKeywords: [],
            archiveAndDistributionInformation: {
              fileDistributionInformation: [
                {
                  formatType: 'Native',
                  fees: 'Free',
                  format: 'ASCII',
                  media: ['FTP']
                }, {
                  format: 'UNSPECIFIED'
                }
              ]
            },
            archiveCenter: 'CONDIMENTUM/TELLUS/PHARETRA',
            associatedDois: [{
              doi: '10.1234/ParentDOIID1',
              title: 'DOI Title 1',
              authority: 'https://doi.org/'
            },
            {
              doi: '10.1234/ParentDOIID2',
              title: 'DOI Title 2',
              authority: 'https://doi.org/'
            }],
            boxes: [],
            browseFlag: true,
            cloudHosted: false,
            collectionCitations: [],
            collectionProgress: 'ACTIVE',
            conceptId: 'C100000-EDSC',
            consortiums: ['GEOSS'],
            contactGroups: [],
            contactPersons: [],
            coordinateSystem: 'CARTESIAN',
            dataCenter: 'PORTA',
            dataCenters: [],
            dataDates: [],
            dataLanguage: 'English',
            datasetId: 'Condimentum Quam Mattis Cursus Pharetra',
            directDistributionInformation: {
              region: 'us-east-2',
              s3BucketAndObjectPrefixNames: ['TestBucketOrObjectPrefix'],
              s3CredentialsApiEndpoint: 'https://DAACCredentialEndpoint.org',
              s3CredentialsApiDocumentationUrl: 'https://DAACCredentialDocumentation.org'
            },
            directoryNames: [],
            doi: {},
            hasFormats: true,
            hasGranules: true,
            hasSpatialSubsetting: true,
            hasTemporalSubsetting: true,
            hasTransforms: true,
            hasVariables: true,
            isoTopicCategories: [],
            lines: [],
            locationKeywords: [],
            metadataAssociations: [],
            metadataDates: [],
            metadataLanguage: 'English',
            metadataFormat: 'RISUS',
            nativeId: 'test-guid',
            nativeDataFormats: ['ASCII'],
            onlineAccessFlag: true,
            organizations: [],
            originalFormat: 'RISUS',
            paleoTemporalCoverages: [],
            platforms: [{
              type: 'Not Specified',
              shortName: 'AQUA',
              longName: 'Earth Observing System, AQUA',
              instruments: [
                {
                  shortName: 'AIRS',
                  longName: 'Atmospheric Infrared Sounder',
                  composedOf: [
                    {
                      shortName: 'AIRS',
                      longName: 'Atmospheric Infrared Sounder'
                    }
                  ]
                }
              ]
            }],
            points: [],
            polygons: [],
            processingLevel: {
              id: 'Not Provided'
            },
            processingLevelId: 'Not Provided',
            projects: [],
            provider: 'PORTA',
            publicationReferences: [],
            purpose: 'Mock Purpose',
            quality: 'Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.',
            relatedUrls: [],
            scienceKeywords: [],
            shortName: 'LOREM-QUAM',
            spatialExtent: {},
            spatialInformation: {},
            standardProduct: true,
            tags: {},
            temporalExtents: [],
            temporalKeywords: [],
            tilingIdentificationSystems: {},
            timeEnd: '2016-04-04T08:00:00.000Z',
            timeStart: '2016-04-04T17:00:00.000Z',
            title: 'Condimentum Quam Mattis Cursus Pharetra',
            useConstraints: [],
            version: '1.0.0',
            versionId: '1.0.0',
            versionDescription: 'The description of the version'
          }]
        }
      })
    })

    test('collections', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/, 'page_size=2')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }, {
              id: 'C100001-EDSC'
            }]
          }
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          collections(limit:2) {
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
        collections: {
          items: [{
            conceptId: 'C100000-EDSC'
          }, {
            conceptId: 'C100001-EDSC'
          }]
        }
      })
    })

    describe('collection', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/, 'concept_id=C100000-EDSC')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collection(conceptId: "C100000-EDSC") {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collection: {
              conceptId: 'C100000-EDSC'
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
            .post(/collections\.json/, 'concept_id=C100000-EDSC')
            .reply(200, {
              feed: {
                entry: []
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collection(conceptId: "C100000-EDSC") {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collection: null
          })
        })
      })
    })
  })

  describe('Collection', () => {
    test('granules', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }, {
              id: 'C100001-EDSC'
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/, 'page_size=20&collection_concept_id=C100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }, {
              id: 'G100001-EDSC'
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/, 'page_size=20&collection_concept_id=C100001-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100002-EDSC'
            }, {
              id: 'G100003-EDSC'
            }]
          }
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          collections {
            items {
              conceptId
              granules {
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

      const { data } = response.body.singleResult

      expect(data).toEqual({
        collections: {
          items: [{
            conceptId: 'C100000-EDSC',
            granules: {
              items: [{
                conceptId: 'G100000-EDSC'
              }, {
                conceptId: 'G100001-EDSC'
              }]
            }
          }, {
            conceptId: 'C100001-EDSC',
            granules: {
              items: [{
                conceptId: 'G100002-EDSC'
              }, {
                conceptId: 'G100003-EDSC'
              }]
            }
          }]
        }
      })
    })

    test('granules with arguments passed from the collection', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }, {
              id: 'C100001-EDSC'
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/, 'page_size=20&bounding_box=-90.08940124511719,41.746426050239336,-82.33992004394531,47.84755587105307&collection_concept_id=C100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }, {
              id: 'G100001-EDSC'
            }]
          }
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/granules\.json/, 'page_size=20&bounding_box=-90.08940124511719,41.746426050239336,-82.33992004394531,47.84755587105307&collection_concept_id=C100001-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100002-EDSC'
            }, {
              id: 'G100003-EDSC'
            }]
          }
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          collections(
            limit:2
            boundingBox:"-90.08940124511719,41.746426050239336,-82.33992004394531,47.84755587105307"
          ) {
            items {
              conceptId
              granules {
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

      const { data } = response.body.singleResult

      expect(data).toEqual({
        collections: {
          items: [{
            conceptId: 'C100000-EDSC',
            granules: {
              items: [{
                conceptId: 'G100000-EDSC'
              }, {
                conceptId: 'G100001-EDSC'
              }]
            }
          }, {
            conceptId: 'C100001-EDSC',
            granules: {
              items: [{
                conceptId: 'G100002-EDSC'
              }, {
                conceptId: 'G100003-EDSC'
              }]
            }
          }]
        }
      })
    })

    describe('services', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return services', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }, {
                  id: 'C100001-EDSC'
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  services {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                services: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                services: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('associations are present in the metadata but not service associations', () => {
        test('doesn\'t query for or return services', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    variables: [{ concept_id: 'V100000-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    variables: [{ concept_id: 'V100000-EDSC' }]
                  }
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  services {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                services: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                services: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('when service associations are present in the metadata', () => {
        test('queries for and returns services', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }, { concept_id: 'S100001-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100002-EDSC' }, { concept_id: 'S100003-EDSC' }]
                  }
                }]
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id[]=S100000-EDSC&concept_id[]=S100001-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'S100000-EDSC'
              }, {
                concept_id: 'S100001-EDSC'
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/services\.json/, 'concept_id[]=S100002-EDSC&concept_id[]=S100003-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'S100002-EDSC'
              }, {
                concept_id: 'S100003-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  services {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                services: {
                  items: [{
                    conceptId: 'S100000-EDSC'
                  }, {
                    conceptId: 'S100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'C100001-EDSC',
                services: {
                  items: [{
                    conceptId: 'S100002-EDSC'
                  }, {
                    conceptId: 'S100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })
    })

    describe('subscriptions', () => {
      test('queries for and returns subscriptions', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/collections\.json/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100000-EDSC'
              }, {
                id: 'C100001-EDSC'
              }]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/subscriptions\.json/, 'page_size=20&collection_concept_id=C100000-EDSC')
          .reply(200, {
            items: [{
              concept_id: 'SUB100000-EDSC'
            }, {
              concept_id: 'SUB100001-EDSC'
            }]
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/subscriptions\.json/, 'page_size=20&collection_concept_id=C100001-EDSC')
          .reply(200, {
            items: [{
              concept_id: 'SUB100002-EDSC'
            }, {
              concept_id: 'SUB100003-EDSC'
            }]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            collections {
              items {
                conceptId
                subscriptions {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          collections: {
            items: [{
              conceptId: 'C100000-EDSC',
              subscriptions: {
                items: [{
                  conceptId: 'SUB100000-EDSC'
                }, {
                  conceptId: 'SUB100001-EDSC'
                }]
              }
            }, {
              conceptId: 'C100001-EDSC',
              subscriptions: {
                items: [{
                  conceptId: 'SUB100002-EDSC'
                }, {
                  conceptId: 'SUB100003-EDSC'
                }]
              }
            }]
          }
        })
      })
    })

    describe('tools', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return tools', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }, {
                  id: 'C100001-EDSC'
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  tools {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                tools: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                tools: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('associations are present in the metadata but not tool associations', () => {
        test('doesn\'t query for or return tools', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    variables: [{ concept_id: 'V100000-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    variables: [{ concept_id: 'V100000-EDSC' }]
                  }
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  tools {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                tools: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                tools: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('when tool associations are present in the metadata', () => {
        test('queries for and returns tools', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    tools: [{ concept_id: 'T100000-EDSC' }, { concept_id: 'T100001-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    tools: [{ concept_id: 'T100002-EDSC' }, { concept_id: 'T100003-EDSC' }]
                  }
                }]
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/tools\.json/, 'concept_id[]=T100000-EDSC&concept_id[]=T100001-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'T100000-EDSC'
              }, {
                concept_id: 'T100001-EDSC'
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/tools\.json/, 'concept_id[]=T100002-EDSC&concept_id[]=T100003-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'T100002-EDSC'
              }, {
                concept_id: 'T100003-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  tools {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                tools: {
                  items: [{
                    conceptId: 'T100000-EDSC'
                  }, {
                    conceptId: 'T100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'C100001-EDSC',
                tools: {
                  items: [{
                    conceptId: 'T100002-EDSC'
                  }, {
                    conceptId: 'T100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })
    })

    describe('variables', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return variables', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }, {
                  id: 'C100001-EDSC'
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  variables {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                variables: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                variables: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('associations are present in the metadata but not variable associations', () => {
        test('doesn\'t query for or return variables', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }]
                  }
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  variables {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                variables: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                variables: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('when variable associations are present in the metadata', () => {
        test('queries for and returns variables', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    variables: [{ concept_id: 'V100000-EDSC' }, { concept_id: 'V100001-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    variables: [{ concept_id: 'V100002-EDSC' }, { concept_id: 'V100003-EDSC' }]
                  }
                }]
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/variables\.json/, 'concept_id[]=V100000-EDSC&concept_id[]=V100001-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'V100000-EDSC'
              }, {
                concept_id: 'V100001-EDSC'
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/variables\.json/, 'concept_id[]=V100002-EDSC&concept_id[]=V100003-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'V100002-EDSC'
              }, {
                concept_id: 'V100003-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  variables {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                variables: {
                  items: [{
                    conceptId: 'V100000-EDSC'
                  }, {
                    conceptId: 'V100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'C100001-EDSC',
                variables: {
                  items: [{
                    conceptId: 'V100002-EDSC'
                  }, {
                    conceptId: 'V100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })
    })

    describe('data-quality-summaries', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return data-quality-summaries', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC'
                }, {
                  id: 'C100001-EDSC'
                }]
              }
            })
          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  dataQualitySummaries {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                dataQualitySummaries: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                dataQualitySummaries: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('associations are present in the metadata but not data-quality-summary summary associations', () => {
        test('doesn\'t query for or return data-quality-summaries', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    services: [{ concept_id: 'S100000-EDSC' }]
                  }
                }]
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  dataQualitySummaries {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                dataQualitySummaries: {
                  items: null
                }
              }, {
                conceptId: 'C100001-EDSC',
                dataQualitySummaries: {
                  items: null
                }
              }]
            }
          })
        })
      })

      describe('when data-quality-summary associations are present in the metadata', () => {
        test('queries for and returns data-quality-summaries', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    dataQualitySummaries: [{ concept_id: 'DQS100000-EDSC' }, { concept_id: 'DQS100001-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    dataQualitySummaries: [{ concept_id: 'DQS100002-EDSC' }, { concept_id: 'DQS100003-EDSC' }]
                  }
                }]
              }
            })
            .post(/data-quality-summaries\.json/, 'concept_id[]=DQS100000-EDSC&concept_id[]=DQS100001-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'DQS100000-EDSC'
              }, {
                concept_id: 'DQS100001-EDSC'
              }]
            })
            // Second call is needed for the other collection's DQS call
            .post(/data-quality-summaries\.json/, 'concept_id[]=DQS100002-EDSC&concept_id[]=DQS100003-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'DQS100002-EDSC'
              }, {
                concept_id: 'DQS100003-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  dataQualitySummaries {
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

          const { data } = response.body.singleResult

          expect(data).toEqual({
            collections: {
              items: [{
                conceptId: 'C100000-EDSC',
                dataQualitySummaries: {
                  items: [{
                    conceptId: 'DQS100000-EDSC'
                  }, {
                    conceptId: 'DQS100001-EDSC'
                  }]
                }
              },
              {
                conceptId: 'C100001-EDSC',
                dataQualitySummaries: {
                  items: [{
                    conceptId: 'DQS100002-EDSC'
                  }, {
                    conceptId: 'DQS100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })
    })

    describe('relatedCollections', () => {
      test('queries CMR GraphDB for relationships', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/collections\.json/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'C1200400842-GHRC'
              }]
            }
          })

        nock(/example-graphdb/)
          .post(() => true)
          .reply(200, relatedCollectionsGraphdbResponseMocks)

        const response = await server.executeOperation({
          variables: {},
          query: `{
            collections (
              conceptId: "C1200400842-GHRC"
            ) {
              items {
                conceptId
                relatedCollections {
                  count
                  items {
                    id
                    title
                    doi
                    relationships {
                      relationshipType
                      ... on GraphDbProject {
                        name
                      }
                      ... on GraphDbPlatformInstrument {
                        platform
                        instrument
                      }
                      ... on GraphDbRelatedUrl {
                        url
                        description
                        type
                        subtype
                      }
                    }
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual(relatedCollectionsResponseMocks.data)
      })
    })

    describe('duplicateCollections', () => {
      test('queries CMR GraphDB for relationships', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/collections\.umm_json/)
          .reply(200, {
            hits: 1,
            items: [{
              meta: {
                'concept-id': 'C1200383041-CMR_ONLY'
              },
              umm: {
                ShortName: '7333',
                DOI: {
                  DOI: '10.5067/MEASURES/DMSP-F16/SSMIS/DATA301'
                }
              }
            }]
          })

        nock(/example-graphdb/)
          .post(() => true)
          .reply(200, duplicateCollectionsGraphdbResponseMocks)

        const response = await server.executeOperation({
          variables: {},
          query: `{
            collections (
              conceptId: "C1200383041-CMR_ONLY"
            ) {
              items {
                conceptId
                duplicateCollections {
                  count
                  items {
                    id
                    title
                    shortName
                    doi
                  }
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual(duplicateCollectionsResponseMocks.data)
      })
    })
  })

  describe('Relationship', () => {
    describe('When the object has the relatedUrl relationshipType', () => {
      test('returns the correct type', () => {
        const { Relationship: relationship } = resolvers
        const { __resolveType: resolveType } = relationship

        const result = resolveType({ relationshipType: 'relatedUrl' })
        expect(result).toEqual('GraphDbRelatedUrl')
      })
    })

    describe('When the object has the relatedUrl relationshipType', () => {
      test('returns the correct type', () => {
        const { Relationship: relationship } = resolvers
        const { __resolveType: resolveType } = relationship

        const result = resolveType({ relationshipType: 'project' })
        expect(result).toEqual('GraphDbProject')
      })
    })

    describe('When the object has the relatedUrl relationshipType', () => {
      test('returns the correct type', () => {
        const { Relationship: relationship } = resolvers
        const { __resolveType: resolveType } = relationship

        const result = resolveType({ relationshipType: 'platformInstrument' })
        expect(result).toEqual('GraphDbPlatformInstrument')
      })
    })

    describe('When the object type is not recognized', () => {
      test('returns the correct type', () => {
        const { Relationship: relationship } = resolvers
        const { __resolveType: resolveType } = relationship

        const result = resolveType({ relationshipType: 'something wrong' })
        expect(result).toEqual(null)
      })
    })
  })
})
