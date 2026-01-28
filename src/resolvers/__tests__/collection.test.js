import nock from 'nock'

import { mockClient } from 'aws-sdk-client-mock'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

import resolvers from '..'
import { buildContextValue, server } from './__mocks__/mockServer'

import duplicateCollectionsGraphdbResponseMocks from './__mocks__/duplicateCollections.graphdbResponse.mocks'
import duplicateCollectionsResponseMocks from './__mocks__/duplicateCollections.response.mocks'
import relatedCollectionsGraphdbResponseMocks from './__mocks__/relatedCollections.graphdbResponse.mocks'
import relatedCollectionsResponseMocks from './__mocks__/relatedCollections.response.mocks'
// Commenting out until advanced Citation associations are worked out
// import associatedCitationsCollectionResolverGraphdbResponseMocks from './__mocks__/associatedCitations.collectionResolver.graphdbResponse.mocks'
// import associatedCitationsCollectionResolverResponseMocks from './__mocks__/associatedCitations.collectionResolver.response.mocks'

const contextValue = buildContextValue()

const lambdaClientMock = mockClient(LambdaClient)

beforeEach(() => {
  lambdaClientMock.reset()
})

describe('Collection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
    process.env.graphdbHost = 'http://example-graphdb.com'
    process.env.graphdbPort = '8182'
    process.env.graphdbPath = ''
    process.env.graphdbEnabled = 'true'
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
        .get(/collections\.json/)
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
              entry_id: 'LOREM-QUAM_1.0.0',
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
                        apply: 'http://example-cmr.com:443/search/collections.json?include_facets=v2&science_keywords_h%5B0%5D%5Btopic%5D=Aerosols'
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
        .get(/collections\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC',
              'native-id': 'test-guid',
              'revision-id': '2',
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
              DataMaturity: 'Validated',
              DirectDistributionInformation: {
                region: 'us-east-2',
                s3BucketAndObjectPrefixNames: ['TestBucketOrObjectPrefix'],
                s3CredentialsApiEndpoint: 'https://DAACCredentialEndpoint.org',
                s3CredentialsApiDocumentationUrl: 'https://DAACCredentialDocumentation.org'
              },
              DirectoryNames: [],
              DOI: {
                DOI: '10.1234/NASA/Example.01',
                PreviousVersion: {
                  Version: 'A.1',
                  Description: 'The version before this one',
                  DOI: '10.1234/NASA/Example.02',
                  Published: '2024-02-14T08:01:00Z'
                }
              },
              FileNamingConvention: {
                Convention: 'YYYY-MM-DD.Short-Name',
                Description: 'ISO date followed by the short name'
              },
              ISOTopicCategories: [],
              LocationKeywords: [],
              MetadataAssociations: [],
              MetadataDates: [],
              MetadataLanguage: 'English',
              OtherIdentifiers: [
                {
                  Identifier: 'ECSE-1475-Internal',
                  Type: 'Other',
                  DescriptionOfOtherType: 'Jira number'
                },
                {
                  Identifier: 'ECSE-1475-Internal',
                  Type: 'ArchiveSetsNumber'
                }
              ],
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
              SpatialExtent: {
                SpatialCoverageType: 'LUNAR',
                GranuleSpatialRepresentation: 'CARTESIAN'
              },
              SpatialInformation: {},
              StandardProduct: true,
              TemporalExtents: [
                {
                  EndsAtPresentFlag: false,
                  SingleDateTimes: [
                    '2024-02-14T13:14:15.000Z'
                  ],
                  TemporalResolution: {
                    Unit: 'Year',
                    Value: 42
                  }
                }
              ],
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

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 2,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/collections.umm_json?all_revisions=true&concept_id=C100000-EDSC')
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC',
              'native-id': 'test-guid',
              'revision-id': '2'
            },
            umm: {
              Abstract: 'Cras mattis consectetur purus sit amet fermentum.'
            }
          }, {
            meta: {
              'concept-id': 'C100000-EDSC',
              'native-id': 'test-guid',
              'revision-id': '1'
            },
            umm: {
              Abstract: 'Cras mattis consectetur purus sit amet fermentum.'
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
              associatedDois
              associationDetails
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
              dataMaturity
              datasetId
              directDistributionInformation
              directoryNames
              doi
              entryId
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
              otherIdentifiers
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
              revisions {
                count
                items {
                  revisionId
                }
              }
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

      const { data, errors } = response.body.singleResult

      expect(errors).toBeUndefined()

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
                      apply: 'http://example-cmr.com:443/search/collections.json?include_facets=v2&science_keywords_h%5B0%5D%5Btopic%5D=Aerosols'
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
            dataMaturity: 'Validated',
            datasetId: 'Condimentum Quam Mattis Cursus Pharetra',
            directDistributionInformation: {
              region: 'us-east-2',
              s3BucketAndObjectPrefixNames: ['TestBucketOrObjectPrefix'],
              s3CredentialsApiEndpoint: 'https://DAACCredentialEndpoint.org',
              s3CredentialsApiDocumentationUrl: 'https://DAACCredentialDocumentation.org'
            },
            directoryNames: [],
            doi: {
              doi: '10.1234/NASA/Example.01',
              previousVersion: {
                description: 'The version before this one',
                doi: '10.1234/NASA/Example.02',
                published: '2024-02-14T08:01:00Z',
                version: 'A.1'
              }
            },
            entryId: 'LOREM-QUAM_1.0.0',
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
            otherIdentifiers: [
              {
                descriptionOfOtherType: 'Jira number',
                identifier: 'ECSE-1475-Internal',
                type: 'Other'
              },
              {
                identifier: 'ECSE-1475-Internal',
                type: 'ArchiveSetsNumber'
              }
            ],
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
            revisions: {
              count: 2,
              items: [
                {
                  revisionId: '2'
                },
                {
                  revisionId: '1'
                }
              ]
            },
            scienceKeywords: [],
            shortName: 'LOREM-QUAM',
            spatialExtent: {
              granuleSpatialRepresentation: 'CARTESIAN',
              spatialCoverageType: 'LUNAR'
            },
            spatialInformation: {},
            standardProduct: true,
            tags: {},
            temporalExtents: [
              {
                endsAtPresentFlag: false,
                singleDateTimes: [
                  '2024-02-14T13:14:15.000Z'
                ],
                temporalResolution: {
                  unit: 'Year',
                  value: 42
                }
              }
            ],
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

    describe('collections', () => {
      test('returns results', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/collections.json?page_size=2')
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
    })

    describe('collection', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/collections.json?concept_id=C100000-EDSC')
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
            .get('/search/collections.json?concept_id=C100000-EDSC')
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

      describe('when retrieving revisions that contain tombstones', () => {
        test('includes them in the results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Hits': 1,
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100001-EDSC'
                }],
                facets: {}
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Hits': 3,
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/collections.umm_json?all_revisions=true&concept_id=C100001-EDSC')
            .reply(200, {
              items: [{
                meta: {
                  'concept-id': 'C100001-EDSC',
                  'revision-id': '3',
                  deleted: false
                },
                umm: {
                  Abstract: 'Cras mattis consectetur purus sit amet fermentum.'
                }
              }, {
                meta: {
                  'concept-id': 'C100001-EDSC',
                  'revision-id': '2',
                  deleted: true
                }
              }, {
                meta: {
                  'concept-id': 'C100001-EDSC',
                  'revision-id': '1',
                  deleted: false
                },
                umm: {
                  Abstract: 'Cras mattis consectetur purus sit amet fermentum.'
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
                  conceptId
                  revisions {
                    count
                    items {
                      revisionId
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
            collections: {
              count: 1,
              facets: {},
              items: [{
                conceptId: 'C100001-EDSC',
                revisions: {
                  count: 3,
                  items: [
                    {
                      revisionId: '3'
                    },
                    {
                      revisionId: '2'
                    },
                    {
                      revisionId: '1'
                    }
                  ]
                }
              }]
            }
          })
        })
      })

      describe('when retrieving revisions that may contain umm:null', () => {
        test('includes them in the results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Hits': 1,
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100001-EDSC'
                }],
                facets: {}
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Hits': 3,
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/collections.umm_json?all_revisions=true&concept_id=C100001-EDSC')
            .reply(200, {
              items: [{
                meta: {
                  'concept-id': 'C100001-EDSC',
                  'revision-id': '3',
                  deleted: false
                },
                umm: {
                  Abstract: 'Cras mattis consectetur purus sit amet fermentum.'
                }
              }, {
                meta: {
                  'concept-id': 'C100001-EDSC',
                  'revision-id': '2',
                  deleted: false
                },
                umm: null
              }, {
                meta: {
                  'concept-id': 'C100001-EDSC',
                  'revision-id': '1',
                  deleted: false
                },
                umm: {
                  Abstract: 'Cras mattis consectetur purus sit amet fermentum.'
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
                  conceptId
                  revisions {
                    count
                    items {
                      revisionId
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
            collections: {
              count: 1,
              facets: {},
              items: [{
                conceptId: 'C100001-EDSC',
                revisions: {
                  count: 3,
                  items: [
                    {
                      revisionId: '3'
                    },
                    {
                      revisionId: '2'
                    },
                    {
                      revisionId: '1'
                    }
                  ]
                }
              }]
            }
          })
        })
      })
    })
  })

  describe('Collection', () => {
    describe('fetch', () => {
      test('fetches a specific revision of a collection', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/concepts/C100000-EDSC/2.umm_json')
          .reply(200, {
            EntryTitle: 'Test Collection'
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'C100000-EDSC',
              revisionId: '2'
            }
          },
          query: `
          query Collection($params: CollectionInput!) {
            collection(params: $params) {
              conceptId
              revisionId
              entryTitle
            }
          }
        `
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          collection: {
            conceptId: 'C100000-EDSC',
            revisionId: '2',
            entryTitle: 'Test Collection'
          }
        })
      })

      test('fetches all revisions when meta-only fields are needed', async () => {
        // Mock the first API call
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/concepts/C100000-EDSC/2.umm_json')
          .reply(200, {
          })

        // Mock the second API call
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/collections.umm_json?concept_id=C100000-EDSC&all_revisions=true')
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'C100000-EDSC',
                  'revision-id': '2',
                  'revision-date': '2023-01-01T00:00:00Z'
                },
                umm: {}
              },
              {
                meta: {
                  'concept-id': 'C100000-EDSC',
                  'revision-id': '1',
                  'revision-date': '2022-12-31T00:00:00Z'
                },
                umm: {}
              }
            ]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'C100000-EDSC',
              revisionId: '2'
            }
          },
          query: `
          query Collection($params: CollectionInput!) {
            collection(params: $params) {
              conceptId
              revisionId
              revisionDate
            }
          }
        `
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          collection: {
            conceptId: 'C100000-EDSC',
            revisionId: '2',
            revisionDate: '2023-01-01T00:00:00Z'
          }
        })
      })

      test('throws an error when the requested revision is not found', async () => {
        // Mock the first API call
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/concepts/C100000-EDSC/3.umm_json')
          .reply(200, {
          })

        // Mock the second API call with revisions that don't include the requested revision
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/collections.umm_json?concept_id=C100000-EDSC&all_revisions=true')
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'C100000-EDSC',
                  'revision-id': '1',
                  'revision-date': '2022-12-31T00:00:00Z'
                },
                umm: {}
              },
              {
                meta: {
                  'concept-id': 'C100000-EDSC',
                  'revision-id': '2',
                  'revision-date': '2023-01-01T00:00:00Z'
                },
                umm: {}
              }
            ]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'C100000-EDSC',
              revisionId: '3'
            }
          },
          query: `
            query Collection($params: CollectionInput!) {
              collection(params: $params) {
                conceptId
                revisionId
                revisionDate
              }
            }
          `
        }, {
          contextValue
        })

        const { errors } = response.body.singleResult

        expect(errors).toBeDefined()
        expect(errors[0].message).toBe('Error: Revision 3 not found in all revisions response')
      })

      test('throws an error when there is no existing item to merge meta fields into', async () => {
        // Mock the first API call to return an empty response
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/concepts/C100000-EDSC/2.umm_json')
          .reply(200, {
            items: []
          })

        // Mock the second API call to return revisions
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/collections.umm_json?concept_id=C100000-EDSC&all_revisions=true')
          .reply(200, {
            items: [
              {
                meta: {
                  'concept-id': 'C100000-EDSC',
                  'revision-id': '2',
                  'revision-date': '2023-01-01T00:00:00Z'
                },
                umm: {}
              }
            ]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'C100000-EDSC',
              revisionId: '2'
            }
          },
          query: `
    query Collection($params: CollectionInput!) {
      collection(params: $params) {
        conceptId
        revisionId
        revisionDate
      }
    }
  `
        }, {
          contextValue
        })

        const { errors } = response.body.singleResult

        expect(errors).toBeDefined()
        expect(errors[0].message).toBe('Error: No existing item found to merge meta fields into')
      })
    })

    describe('revisions', () => {
      test('throws an error when revisionId is provided', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/concepts/C100000-EDSC/2.umm_json')
          .reply(200, {})

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'C100000-EDSC',
              revisionId: '2'
            }
          },
          query: `
            query Collection($params: CollectionInput!) {
              collection(params: $params) {
                conceptId
                revisionId
                revisions {
                  count
                }
              }
            }
          `
        }, {
          contextValue
        })

        const { errors } = response.body.singleResult

        expect(errors).toBeDefined()
        expect(errors[0].message).toBe(
          'The "revisions" field cannot be requested when querying a specific revision. '
        + 'Remove the "revisionId" parameter from the collection query to fetch all revisions.'
        )
      })
    })

    describe('relatedCollections', () => {
      test('throws an error when revisionId is provided', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/concepts/C100000-EDSC/2.umm_json')
          .reply(200, {})

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'C100000-EDSC',
              revisionId: '2'
            }
          },
          query: `
            query Collection($params: CollectionInput!) {
              collection(params: $params) {
                conceptId
                revisionId
                relatedCollections {
                  count
                }
              }
            }
          `
        }, {
          contextValue
        })

        const { errors } = response.body.singleResult

        expect(errors).toBeDefined()
        expect(errors[0].message).toBe(
          'The "relatedCollections" field cannot be requested when querying a specific revision. '
        + 'Remove the "revisionId" parameter from the collection query to fetch related collections.'
        )
      })
    })

    describe('duplicateCollections', () => {
      test('throws an error when revisionId is provided', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/concepts/C100000-EDSC/2.umm_json')
          .reply(200, {})

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'C100000-EDSC',
              revisionId: '2'
            }
          },
          query: `
            query Collection($params: CollectionInput!) {
              collection(params: $params) {
                conceptId
                revisionId
                duplicateCollections {
                  count
                }
              }
            }
          `
        }, {
          contextValue
        })

        const { errors } = response.body.singleResult

        expect(errors).toBeDefined()
        expect(errors[0].message).toBe(
          'The "duplicateCollections" field cannot be requested when querying a specific revision. '
        + 'Remove the "revisionId" parameter from the collection query to fetch duplicate collections.'
        )
      })
    })

    describe('granules', () => {
      test('granules', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collections\.json/)
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
          .get('/search/granules.json?page_size=20&collection_concept_id=C100000-EDSC')
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
          .get('/search/granules.json?page_size=20&collection_concept_id=C100001-EDSC')
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
          .get(/collections\.json/)
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
          .get('/search/granules.json?page_size=20&bounding_box=-90.08940124511719,41.746426050239336,-82.33992004394531,47.84755587105307&collection_concept_id=C100000-EDSC')
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
          .get('/search/granules.json?page_size=20&bounding_box=-90.08940124511719,41.746426050239336,-82.33992004394531,47.84755587105307&collection_concept_id=C100001-EDSC')
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

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    granules {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                granules: null
              }
            }, {
              previewMetadata: {
                granules: null
              }
            }]
          }
        })
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
            .get(/collections\.json/)
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
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                services: {
                  items: []
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
            .get(/collections\.json/)
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
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                services: {
                  items: []
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
            .get(/collections\.json/)
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
            .get('/search/services.json?concept_id[]=S100000-EDSC&concept_id[]=S100001-EDSC&page_size=2')
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
            .get('/search/services.json?concept_id[]=S100002-EDSC&concept_id[]=S100003-EDSC&page_size=2')
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

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    services {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                services: null
              }
            }, {
              previewMetadata: {
                services: null
              }
            }]
          }
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
          .get(/collections\.json/)
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
          .get('/search/subscriptions.json?page_size=20&collection_concept_id=C100000-EDSC')
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
          .get('/search/subscriptions.json?page_size=20&collection_concept_id=C100001-EDSC')
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

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    subscriptions {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                subscriptions: null
              }
            }, {
              previewMetadata: {
                subscriptions: null
              }
            }]
          }
        })
      })
    })

    describe('tagDefinition', () => {
      test('when there tag value is null', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collections\.json/)
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
          .get(/tags/)
          .reply(200, {
            items: [
              {
                concept_id: 'C100000',
                tag_key: 'Mock tag key',
                description: 'Mock tag description.',
                revision_id: '1',
                originator_id: 'test-user'
              }
            ]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            collections {
              items {
                conceptId
                tagDefinitions {
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
              tagDefinitions: null
            }]
          }
        })
      })

      test('when there is a tag value', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collections\.json/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100000-EDSC',
                tags: {
                  'test.new': {
                    data: 'Test tag 2'
                  }
                }
              }]
            }
          })

        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/tags/)
          .reply(200, {
            items: [
              {
                concept_id: 'C100000',
                tag_key: 'Mock tag key',
                description: 'Mock tag description.',
                revision_id: '1',
                originator_id: 'test-user'
              }
            ]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            collections {
              items {
                conceptId
                tagDefinitions {
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
              tagDefinitions: {
                items: [{
                  conceptId: 'C100000'
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
            .get(/collections\.json/)
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
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                tools: {
                  items: []
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
            .get(/collections\.json/)
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
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                tools: {
                  items: []
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
            .get(/collections\.json/)
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
            .get('/search/tools.json?concept_id[]=T100000-EDSC&concept_id[]=T100001-EDSC&page_size=20')
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
            .get('/search/tools.json?concept_id[]=T100002-EDSC&concept_id[]=T100003-EDSC&page_size=20')
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

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    tools {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                tools: null
              }
            }, {
              previewMetadata: {
                tools: null
              }
            }]
          }
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
            .get(/collections\.json/)
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
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                variables: {
                  items: []
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
            .get(/collections\.json/)
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
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                variables: {
                  items: []
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
            .get(/collections\.json/)
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
            .get('/search/variables.json?concept_id[]=V100000-EDSC&concept_id[]=V100001-EDSC&page_size=20')
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
            .get('/search/variables.json?concept_id[]=V100002-EDSC&concept_id[]=V100003-EDSC&page_size=20')
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

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    variables {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                variables: null
              }
            }, {
              previewMetadata: {
                variables: null
              }
            }]
          }
        })
      })
    })

    describe('visualizations', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return visualizations', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
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
                  visualizations {
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
                visualizations: {
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                visualizations: {
                  items: []
                }
              }]
            }
          })
        })
      })

      describe('associations are present in the metadata but not visualization associations', () => {
        test('doesn\'t query for or return visualizations', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
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
                  visualizations {
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
                visualizations: {
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                visualizations: {
                  items: []
                }
              }]
            }
          })
        })
      })

      describe('when visualization associations are present in the metadata', () => {
        test('queries for and returns visualizations', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    visualizations: [{ concept_id: 'VIS100000-EDSC' }, { concept_id: 'VIS100001-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    visualizations: [{ concept_id: 'VIS100002-EDSC' }, { concept_id: 'VIS100003-EDSC' }]
                  }
                }]
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/visualizations.json?concept_id[]=VIS100000-EDSC&concept_id[]=VIS100001-EDSC&page_size=20')
            .reply(200, {
              items: [{
                concept_id: 'VIS100000-EDSC'
              }, {
                concept_id: 'VIS100001-EDSC'
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/visualizations.json?concept_id[]=VIS100002-EDSC&concept_id[]=VIS100003-EDSC&page_size=20')
            .reply(200, {
              items: [{
                concept_id: 'VIS100002-EDSC'
              }, {
                concept_id: 'VIS100003-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  visualizations {
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
                visualizations: {
                  items: [{
                    conceptId: 'VIS100000-EDSC'
                  }, {
                    conceptId: 'VIS100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'C100001-EDSC',
                visualizations: {
                  items: [{
                    conceptId: 'VIS100002-EDSC'
                  }, {
                    conceptId: 'VIS100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    visualizations {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                visualizations: null
              }
            }, {
              previewMetadata: {
                visualizations: null
              }
            }]
          }
        })
      })
    })

    describe('citations', () => {
      describe('no associations are present in the metadata', () => {
        test('doesn\'t query for or return citations', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
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
                  citations {
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
                citations: {
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                citations: {
                  items: []
                }
              }]
            }
          })
        })
      })

      describe('associations are present in the metadata but not citation associations', () => {
        test('doesn\'t query for or return citations', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
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
                  citations {
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
                citations: {
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                citations: {
                  items: []
                }
              }]
            }
          })
        })
      })

      describe('when citation associations are present in the metadata', () => {
        test('queries for and returns citations', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
            .reply(200, {
              feed: {
                entry: [{
                  id: 'C100000-EDSC',
                  association_details: {
                    citations: [{ concept_id: 'CIT100000-EDSC' }, { concept_id: 'CIT100001-EDSC' }]
                  }
                }, {
                  id: 'C100001-EDSC',
                  association_details: {
                    citations: [{ concept_id: 'CIT100002-EDSC' }, { concept_id: 'CIT100003-EDSC' }]
                  }
                }]
              }
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/citations.json?concept_id[]=CIT100000-EDSC&concept_id[]=CIT100001-EDSC&page_size=20')
            .reply(200, {
              items: [{
                concept_id: 'CIT100000-EDSC'
              }, {
                concept_id: 'CIT100001-EDSC'
              }]
            })

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/citations.json?concept_id[]=CIT100002-EDSC&concept_id[]=CIT100003-EDSC&page_size=20')
            .reply(200, {
              items: [{
                concept_id: 'CIT100002-EDSC'
              }, {
                concept_id: 'CIT100003-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              collections {
                items {
                  conceptId
                  citations {
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
                citations: {
                  items: [{
                    conceptId: 'CIT100000-EDSC'
                  }, {
                    conceptId: 'CIT100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'C100001-EDSC',
                citations: {
                  items: [{
                    conceptId: 'CIT100002-EDSC'
                  }, {
                    conceptId: 'CIT100003-EDSC'
                  }]
                }
              }]
            }
          })
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    citations {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                citations: null
              }
            }, {
              previewMetadata: {
                citations: null
              }
            }]
          }
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
            .get(/collections\.json/)
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
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                dataQualitySummaries: {
                  items: []
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
            .get(/collections\.json/)
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
                  items: []
                }
              }, {
                conceptId: 'C100001-EDSC',
                dataQualitySummaries: {
                  items: []
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
            .get(/collections\.json/)
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
            .get('/search/data-quality-summaries.json?concept_id[]=DQS100000-EDSC&concept_id[]=DQS100001-EDSC&page_size=2')
            .reply(200, {
              items: [{
                concept_id: 'DQS100000-EDSC'
              }, {
                concept_id: 'DQS100001-EDSC'
              }]
            })
            // Second call is needed for the other collection's DQS call
            .get('/search/data-quality-summaries.json?concept_id[]=DQS100002-EDSC&concept_id[]=DQS100003-EDSC&page_size=2')
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

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    dataQualitySummaries {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                dataQualitySummaries: null
              }
            }, {
              previewMetadata: {
                dataQualitySummaries: null
              }
            }]
          }
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
          .get(/collections\.json/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100000-EDSC'
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
              conceptId: "C100000-EDSC"
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
                      ... on GraphDbScienceKeyword {
                        level
                        value
                        variableLevel1
                      }
                      ... on GraphDbCitation {
                        title
                        id
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

      describe('when graphdb is not enabled', () => {
        test('returns an empty no related collections response', async () => {
          process.env.graphdbEnabled = 'false'

          // No nock to graphdb since we are disabling it
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.json/)
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
              collections (
                conceptId: "C100000-EDSC"
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
                        ... on GraphDbScienceKeyword {
                          level
                          value
                          variableLevel1
                        }
                        ... on GraphDbCitation {
                          title
                          id
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

          expect(data).toEqual({
            collections: {
              items: [
                {
                  conceptId: 'C100000-EDSC',
                  relatedCollections: {
                    count: 0,
                    items: []
                  }
                }
              ]
            }
          })
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    relatedCollections {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                relatedCollections: null
              }
            }, {
              previewMetadata: {
                relatedCollections: null
              }
            }]
          }
        })
      })
    })

    describe('generateCollectionVariableDrafts', () => {
      test('calls earthdata-varinfo lambda to generate variable drafts', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collections\.json/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100000-EDSC'
              }]
            }
          })

        const variableList = [{
          dataType: 'int32',
          definition: 'Grid/time',
          dimensions: [{
            Name: 'Grid/time',
            Size: 1,
            Type: 'TIME_DIMENSION'
          }],
          longName: 'Grid/time',
          metadataSpecification: {
            Name: 'UMM-Var',
            URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2',
            Version: '1.8.2'
          },
          name: 'Grid/time',
          standardName: 'time',
          units: 'seconds since 1970-01-01 00:00:00 UTC'
        }]

        lambdaClientMock.on(InvokeCommand).resolves({
          Payload: Buffer.from(JSON.stringify({
            isBase64Encoded: false,
            statusCode: 200,
            body: variableList
          }))
        })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'C100000-EDSC'
            }
          },
          query: `{
            collections (
              conceptId: "C100000-EDSC"
            ) {
              items {
                conceptId
                generateVariableDrafts {
                  count
                  items {
                    dataType
                    definition
                    dimensions
                    longName
                    name
                    standardName
                    units
                    metadataSpecification
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
              generateVariableDrafts: {
                count: 1,
                items: variableList
              }
            }]
          }
        })
      })
    })

    // Commenting out until advanced Citation associations are worked out
    // Describe('associatedCitations', () => {
    //   test('returns exception when depth is invalid', async () => {
    //     nock(/example-cmr/)
    //       .defaultReplyHeaders({
    //         'CMR-Took': 7,
    //         'CMR-Request-Id': 'abcd-1234-efgh-5678'
    //       })
    //       .get(/collections\.json/)
    //       .reply(200, {
    //         feed: {
    //           entry: [{
    //             id: 'C100000-EDSC'
    //           }]
    //         }
    //       })

    //     const response = await server.executeOperation({
    //       variables: {},
    //       query: `{
    //         collections (
    //           conceptId: "C100000-EDSC"
    //         ) {
    //           items {
    //             conceptId
    //             associatedCitations(params: { depth: 4 }) {
    //               count
    //               items {
    //                 id
    //               }
    //             }
    //           }
    //         }
    //       }`
    //     }, {
    //       contextValue
    //     })

    //     expect(response.body.kind).toBe('single')
    //     expect(response.body.singleResult.errors).toBeDefined()
    //     expect(response.body.singleResult.errors[0].message).toBe('Depth must be between 1 and 3')
    //   })

    //   test('queries CMR GraphDB for associated citations', async () => {
    //     nock(/example-cmr/)
    //       .defaultReplyHeaders({
    //         'CMR-Took': 7,
    //         'CMR-Request-Id': 'abcd-1234-efgh-5678'
    //       })
    //       .get(/collections\.json/)
    //       .reply(200, {
    //         feed: {
    //           entry: [{
    //             id: 'C100000-EDSC'
    //           }]
    //         }
    //       })

    //     nock(/example-graphdb/)
    //       .post(() => true)
    //       .reply(200, associatedCitationsCollectionResolverGraphdbResponseMocks)

    //     const response = await server.executeOperation({
    //       variables: {},
    //       query: `{
    //         collections (
    //           conceptId: "C100000-EDSC"
    //         ) {
    //           items {
    //             conceptId
    //             associatedCitations {
    //               count
    //               items {
    //                 id
    //                 identifier
    //                 identifierType
    //                 name
    //                 title
    //                 abstract
    //               }
    //             }
    //           }
    //         }
    //       }`
    //     }, {
    //       contextValue
    //     })

    //     const { data } = response.body.singleResult

    //     expect(data).toEqual(associatedCitationsCollectionResolverResponseMocks.data)
    //   })

    //   describe('when graphdb is not enabled', () => {
    //     test('returns an empty no associated citations response ', async () => {
    //       process.env.graphdbEnabled = 'false'

    //       nock(/example-cmr/)
    //         .defaultReplyHeaders({
    //           'CMR-Took': 7,
    //           'CMR-Request-Id': 'abcd-1234-efgh-5678'
    //         })
    //         .get(/collections\.json/)
    //         .reply(200, {
    //           feed: {
    //             entry: [{
    //               id: 'C100000-EDSC'
    //             }]
    //           }
    //         })

    //       // No nock to graphdb since we are disabling it

    //       const response = await server.executeOperation({
    //         variables: {},
    //         query: `{
    //           collections (
    //             conceptId: "C100000-EDSC"
    //           ) {
    //             items {
    //               conceptId
    //               associatedCitations {
    //                 count
    //                 items {
    //                   id
    //                   identifier
    //                   identifierType
    //                   name
    //                   title
    //                   abstract
    //                 }
    //               }
    //             }
    //           }
    //         }`
    //       }, {
    //         contextValue
    //       })

    //       const { data } = response.body.singleResult

    //       expect(data).toEqual({
    //         collections: {
    //           items: [
    //             {
    //               conceptId: 'C100000-EDSC',
    //               associatedCitations: {
    //                 count: 0,
    //                 items: []
    //               }
    //             }
    //           ]
    //         }
    //       })
    //     })
    //   })

    //   test('returns null when querying a draft', async () => {
    //     nock(/example-cmr/)
    //       .defaultReplyHeaders({
    //         'CMR-Hits': 2,
    //         'CMR-Took': 7,
    //         'CMR-Request-Id': 'abcd-1234-efgh-5678'
    //       })
    //       .get(/collection-drafts\.umm_json/)
    //       .reply(200, {
    //         items: [{
    //           meta: {
    //             'concept-id': 'CD100000-EDSC'
    //           },
    //           umm: {}
    //         }, {
    //           meta: {
    //             'concept-id': 'CD100001-EDSC'
    //           },
    //           umm: {}
    //         }]
    //       })

    //     const response = await server.executeOperation({
    //       variables: {
    //         params: {
    //           conceptType: 'Collection'
    //         }
    //       },
    //       query: `query Drafts($params: DraftsInput) {
    //         drafts(params: $params) {
    //           items {
    //             previewMetadata {
    //               ... on Collection {
    //                 associatedCitations {
    //                   count
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }`
    //     }, {
    //       contextValue
    //     })

    //     const { data } = response.body.singleResult

    //     expect(data).toEqual({
    //       drafts: {
    //         items: [{
    //           previewMetadata: {
    //             associatedCitations: null
    //           }
    //         }, {
    //           previewMetadata: {
    //             associatedCitations: null
    //           }
    //         }]
    //       }
    //     })
    //   })
    // })

    describe('duplicateCollections', () => {
      test('queries CMR GraphDB for relationships', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collections\.umm_json/)
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

      describe('when graphdb is not enabled', () => {
        test('returns an empty no duplicate collections response', async () => {
          process.env.graphdbEnabled = 'false'

          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/collections\.umm_json/)
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

          // No nock to graphdb since we are disabling it

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

          expect(data).toEqual({
            collections: {
              items: [
                {
                  conceptId: 'C1200383041-CMR_ONLY',
                  duplicateCollections: {
                    count: 0,
                    items: []
                  }
                }
              ]
            }
          })
        })
      })

      test('returns null when querying a draft', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/collection-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Collection {
                    duplicateCollections {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          drafts: {
            items: [{
              previewMetadata: {
                duplicateCollections: null
              }
            }, {
              previewMetadata: {
                duplicateCollections: null
              }
            }]
          }
        })
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

    describe('When the object has the citation relationshipType', () => {
      test('returns the correct type', () => {
        const { Relationship: relationship } = resolvers
        const { __resolveType: resolveType } = relationship

        const result = resolveType({ relationshipType: 'citation' })
        expect(result).toEqual('GraphDbCitation')
      })
    })

    describe('When the object has the scienceKeyword relationshipType', () => {
      test('returns the correct type', () => {
        const { Relationship: relationship } = resolvers
        const { __resolveType: resolveType } = relationship

        const result = resolveType({ relationshipType: 'scienceKeyword' })
        expect(result).toEqual('GraphDbScienceKeyword')
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

  describe('Mutation', () => {
    describe('restoreCollectionRevision', () => {
      test('restores an old version of a collection', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/search/collections.umm_json?concept_id=C100000-EDSC&all_revisions=true')
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'C100000-EDSC',
                'native-id': '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
                'revision-id': 1
              },
              umm: {
                EntryTitle: 'Tortor Elit Fusce Quam Risus'
              }
            }, {
              meta: {
                'concept-id': 'C100000-EDSC',
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
          .put('/ingest/providers/EDSC/collections/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')
          .reply(200, {
            'concept-id': 'C100000-EDSC',
            'revision-id': '3'
          })

        const response = await server.executeOperation({
          variables: {
            revisionId: '1',
            conceptId: 'C100000-EDSC'
          },
          query: `mutation RestoreCollectionRevision (
              $conceptId: String!
              $revisionId: String!
            ) {
              restoreCollectionRevision (
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
          restoreCollectionRevision: {
            conceptId: 'C100000-EDSC',
            revisionId: '3'
          }
        })
      })
    })

    describe('deleteCollection', () => {
      test('deletes a collection', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .delete(/ingest\/providers\/EDSC\/collections\/test-guid/)
          .reply(201, {
            'concept-id': 'C100000-EDSC',
            'revision-id': '1'
          })

        const response = await server.executeOperation({
          variables: {
            nativeId: 'test-guid',
            providerId: 'EDSC'
          },
          query: `mutation DeleteCollection (
              $providerId: String!
              $nativeId: String!
            ) {
              deleteCollection (
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
          deleteCollection: {
            conceptId: 'C100000-EDSC',
            revisionId: '1'
          }
        })
      })
    })
  })
})
