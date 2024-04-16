import nock from 'nock'

import { mockClient } from 'aws-sdk-client-mock'
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

const lambdaClientMock = mockClient(LambdaClient)

beforeEach(() => {
  lambdaClientMock.reset()
})

describe('Variable', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all variable fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/variables\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'V100000-EDSC',
              'native-id': 'test-guid',
              'association-details': {
                collections: [
                  {
                    data: '{"XYZ": "XYZ", "allow-regridding": true}',
                    'concept-id': 'C100000-EDSC'
                  }
                ]
              }
            },
            umm: {
              AdditionalIdentifiers: [],
              DataType: 'Dolor Nullam Venenatis',
              Definition: 'Cras mattis consectetur purus sit amet fermentum.',
              Dimensions: {},
              FillValues: [],
              IndexRanges: {},
              InstanceInformation: {},
              LongName: 'Vehicula Aenean Lorem',
              MeasurementIdentifiers: [],
              Name: 'Vehicula',
              Offset: 1.234,
              RelatedURLs: [],
              Scale: 1.234,
              ScienceKeywords: [],
              Sets: [],
              StandardName: 'all values standard name',
              Units: 'K',
              ValidRanges: {},
              VariableSubType: 'SCIENCE_SCALAR',
              VariableType: 'Malesuada'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          variables {
            count
            items {
              additionalIdentifiers
              associationDetails
              conceptId
              dataType
              definition
              dimensions
              fillValues
              indexRanges
              instanceInformation
              longName
              measurementIdentifiers
              name
              nativeId
              offset
              relatedUrls
              scale
              scienceKeywords
              sets
              standardName
              units
              validRanges
              variableSubType
              variableType
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        variables: {
          count: 1,
          items: [{
            additionalIdentifiers: [],
            associationDetails: {
              collections: [
                {
                  data: '{"XYZ": "XYZ", "allow-regridding": true}',
                  conceptId: 'C100000-EDSC'
                }]
            },
            conceptId: 'V100000-EDSC',
            dataType: 'Dolor Nullam Venenatis',
            definition: 'Cras mattis consectetur purus sit amet fermentum.',
            dimensions: {},
            fillValues: [],
            indexRanges: {},
            instanceInformation: {},
            longName: 'Vehicula Aenean Lorem',
            measurementIdentifiers: [],
            name: 'Vehicula',
            nativeId: 'test-guid',
            offset: 1.234,
            relatedUrls: [],
            scale: 1.234,
            scienceKeywords: [],
            sets: [],
            standardName: 'all values standard name',
            units: 'K',
            validRanges: {},
            variableSubType: 'SCIENCE_SCALAR',
            variableType: 'Malesuada'
          }]
        }
      })
    })

    test('variables', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/variables.json?page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC'
          }, {
            concept_id: 'V100001-EDSC'
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          variables (limit:2) {
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
        variables: {
          items: [{
            conceptId: 'V100000-EDSC'
          }, {
            conceptId: 'V100001-EDSC'
          }]
        }
      })
    })

    describe('variable', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/variables.json?concept_id=V100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'V100000-EDSC',
                long_name: 'Cras mattis consectetur purus sit amet fermentum.',
                name: 'Lorem Ipsum'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              variable (conceptId: "V100000-EDSC") {
                conceptId
                longName
                name
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            variable: {
              conceptId: 'V100000-EDSC',
              longName: 'Cras mattis consectetur purus sit amet fermentum.',
              name: 'Lorem Ipsum'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/variables.json?concept_id=V100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              variable (conceptId: "V100000-EDSC") {
                conceptId
                longName
                name
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            variable: null
          })
        })
      })
    })
  })

  describe('Variable', () => {
    describe('collections', () => {
      test('returns collections when querying a published record', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/variables\.json/)
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
          .get('/search/collections.json?page_size=20&variable_concept_id=V100000-EDSC')
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
          .get('/search/collections.json?page_size=20&variable_concept_id=V100001-EDSC')
          .reply(200, {
            feed: {
              entry: [{
                id: 'C100002-EDSC'
              }, {
                id: 'C100003-EDSC'
              }]
            }
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            variables {
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

        const { data } = response.body.singleResult

        expect(data).toEqual({
          variables: {
            items: [{
              conceptId: 'V100000-EDSC',
              collections: {
                items: [{
                  conceptId: 'C100000-EDSC'
                }, {
                  conceptId: 'C100001-EDSC'
                }]
              }
            }, {
              conceptId: 'V100001-EDSC',
              collections: {
                items: [{
                  conceptId: 'C100002-EDSC'
                }, {
                  conceptId: 'C100003-EDSC'
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
          .get(/variable-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'VD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'VD100001-EDSC'
              },
              umm: {}
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Variable'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Variable {
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

        const { data } = response.body.singleResult

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

      test('returns correct values for Related URLs', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get(/variable-drafts\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'VD100000-EDSC'
              },
              umm: {}
            }, {
              meta: {
                'concept-id': 'VD100001-EDSC'
              },
              umm: {
                RelatedURLs: [
                  {
                    description: 'Test',
                    urlContentType: 'DataCenterURL',
                    type: 'HOME PAGE',
                    url: 'mock url',
                    format: 'HTML',
                    mimeType: 'application/msword'
                  }
                ]
              }
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Variable'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Variable {
                    relatedUrls
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
                relatedUrls: null
              }
            }, {
              previewMetadata: {
                relatedUrls: [{
                  description: 'Test',
                  urlContentType: 'DataCenterURL',
                  type: 'HOME PAGE',
                  url: 'mock url',
                  format: 'HTML',
                  mimeType: 'application/msword'
                }]
              }
            }]
          }
        })
      })
    })
  })

  describe('Mutation', () => {
    test('publishGeneratedVariables calls earthdata-varinfo lambda to publish variable drafts', async () => {
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
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Hits': 1
        })
        .get(/variables\.json/)
        .reply(200, {
          items: [{
            concept_id: 'V10000-EDSC'
          }]
        })

      const variableConceptIdList = [{
        conceptId: 'V10000-EDSC'
      }]

      lambdaClientMock.on(InvokeCommand).resolves({
        Payload: Buffer.from(JSON.stringify({
          isBase64Encoded: false,
          statusCode: 200,
          body: variableConceptIdList
        }))
      })

      const response = await server.executeOperation({
        variables: {
          conceptId: 'C100000-EDSC'
        },
        query: `mutation PublishGeneratedVariables($conceptId: String!) {
            publishGeneratedVariables(conceptId: $conceptId) {
              count
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
        publishGeneratedVariables: {
          count: 1,
          items: variableConceptIdList
        }
      })
    })

    test('deleteVariable', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .delete(/ingest\/providers\/EDSC\/variables\/test-guid/)
        .reply(201, {
          'concept-id': 'V100000-EDSC',
          'revision-id': '1'
        })

      const response = await server.executeOperation({
        variables: {
          nativeId: 'test-guid',
          providerId: 'EDSC'
        },
        query: `mutation DeleteVariable (
            $providerId: String!
            $nativeId: String!
          ) {
            deleteVariable (
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
        deleteVariable: {
          conceptId: 'V100000-EDSC',
          revisionId: '1'
        }
      })
    })
  })
})
