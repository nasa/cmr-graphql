import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Tool', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all tool fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/tools\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'T100000-EDSC',
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
              AccessConstraints: 'NONE',
              AncillaryKeywords: [],
              ContactGroups: [],
              ContactPersons: [],
              Description: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
              DOI: 'doi:10.4225/15/5747A',
              LongName: 'Etiam Mollis Sem Venenatis',
              MetadataSpecification: {},
              Name: 'Etiam',
              Organizations: [],
              PotentialAction: {},
              Quality: {},
              RelatedURLs: [],
              SearchAction: {},
              SupportedBrowsers: [],
              SupportedInputFormats: [],
              SupportedOperatingSystems: [],
              SupportedOutputFormats: [],
              SupportedSoftwareLanguages: [],
              ToolKeywords: [],
              Type: 'Vulputate',
              URL: {},
              UseConstraints: {},
              Version: '1.0.0',
              VersionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          tools {
            count
            items {
              associationDetails
              accessConstraints
              ancillaryKeywords
              conceptId
              contactGroups
              contactPersons
              description
              doi
              longName
              metadataSpecification
              name
              nativeId
              organizations
              potentialAction
              quality
              relatedUrls
              searchAction
              supportedBrowsers
              supportedInputFormats
              supportedOperatingSystems
              supportedOutputFormats
              supportedSoftwareLanguages
              toolKeywords
              type
              url
              useConstraints
              version
              versionDescription
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        tools: {
          count: 1,
          items: [{
            accessConstraints: 'NONE',
            ancillaryKeywords: [],
            associationDetails: {
              collections: [
                {
                  data: '{"XYZ": "XYZ", "allow-regridding": true}',
                  conceptId: 'C100000-EDSC'
                }]
            },
            conceptId: 'T100000-EDSC',
            contactGroups: [],
            contactPersons: [],
            description: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
            doi: 'doi:10.4225/15/5747A',
            longName: 'Etiam Mollis Sem Venenatis',
            metadataSpecification: {},
            name: 'Etiam',
            nativeId: 'test-guid',
            organizations: [],
            potentialAction: {},
            quality: {},
            relatedUrls: [],
            searchAction: {},
            supportedBrowsers: [],
            supportedInputFormats: [],
            supportedOperatingSystems: [],
            supportedOutputFormats: [],
            supportedSoftwareLanguages: [],
            toolKeywords: [],
            type: 'Vulputate',
            url: {},
            useConstraints: {},
            version: '1.0.0',
            versionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          }]
        }
      })
    })

    describe('tools', () => {
      test('with results', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/tools\.json/, 'page_size=2')
          .reply(200, {
            items: [{
              concept_id: 'T100000-EDSC'
            }, {
              concept_id: 'T100001-EDSC'
            }]
          })

        const response = await server.executeOperation({
          variables: {},
          query: `{
            tools (limit:2) {
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
          tools: {
            items: [{
              conceptId: 'T100000-EDSC'
            }, {
              conceptId: 'T100001-EDSC'
            }]
          }
        })
      })
    })

    describe('tool', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/tools\.json/, 'concept_id=T100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'T100000-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              tool (conceptId: "T100000-EDSC") {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            tool: {
              conceptId: 'T100000-EDSC'
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
            .post(/tools\.json/, 'concept_id=T100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              tool (conceptId: "T100000-EDSC") {
                conceptId
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            tool: null
          })
        })
      })
    })

    describe('Mutation', () => {
      test('deleteTool', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .delete(/ingest\/providers\/EDSC\/tools\/test-guid/)
          .reply(201, {
            'concept-id': 'T100000-EDSC',
            'revision-id': '2'
          })

        const response = await server.executeOperation({
          variables: {
            nativeId: 'test-guid',
            providerId: 'EDSC'
          },
          query: `mutation DeleteTool (
          $providerId: String!
          $nativeId: String!
        ) {
          deleteTool (
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
          deleteTool: {
            conceptId: 'T100000-EDSC',
            revisionId: '2'
          }
        })
      })
    })

    describe('Tool', () => {
      describe('collections', () => {
        test('returns collections when querying a published record', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/tools\.json/)
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
            .post(/collections\.json/, 'page_size=20&tool_concept_id=T100000-EDSC')
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
            .post(/collections\.json/, 'page_size=20&tool_concept_id=T100001-EDSC')
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
            tools {
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
            tools: {
              items: [{
                conceptId: 'T100000-EDSC',
                collections: {
                  items: [{
                    conceptId: 'C100000-EDSC'
                  }, {
                    conceptId: 'C100001-EDSC'
                  }]
                }
              }, {
                conceptId: 'T100001-EDSC',
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
            .post(/tool-drafts\.umm_json/)
            .reply(200, {
              items: [{
                meta: {
                  'concept-id': 'TD100000-EDSC'
                },
                umm: {}
              }, {
                meta: {
                  'concept-id': 'TD100001-EDSC'
                },
                umm: {}
              }]
            })

          const response = await server.executeOperation({
            variables: {
              params: {
                conceptType: 'Tool'
              }
            },
            query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              items {
                previewMetadata {
                  ... on Tool {
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
      })
    })
  })
})
