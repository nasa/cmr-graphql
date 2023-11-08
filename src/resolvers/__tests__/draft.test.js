import nock from 'nock'

import resolvers from '..'
import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

jest.mock('uuid', () => ({ v4: () => '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' }))

describe('Draft', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Collection drafts', () => {
    describe('Query', () => {
      test('all draft fields', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/collection-drafts\.umm_json/)
          .reply(200, {
            hits: 1,
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC',
                'concept-type': 'collection-draft',
                deleted: false,
                'native-id': 'test-guid',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-27T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                ShortName: 'Test Draft'
              }
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'CD100000-EDSC',
              conceptType: 'Collection',
              ummVersion: '1.0.0'
            }
          },
          query: `query Draft($params: DraftInput) {
            draft(params: $params) {
              conceptId
              conceptType
              deleted
              name
              nativeId
              providerId
              revisionDate
              revisionId
              ummMetadata
              previewMetadata {
                ... on Collection {
                  conceptId
                  shortName
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          draft: {
            conceptId: 'CD100000-EDSC',
            conceptType: 'collection-draft',
            deleted: false,
            previewMetadata: {
              conceptId: 'CD100000-EDSC',
              shortName: 'Test Draft'
            },
            name: null,
            nativeId: 'test-guid',
            providerId: 'EDSC',
            revisionDate: '2022-05-27T15:18:00.920Z',
            revisionId: '1',
            ummMetadata: {
              ShortName: 'Test Draft'
            }
          }
        })
      })

      test('drafts', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/collection-drafts\.umm_json/)
          .reply(200, {
            hits: 2,
            items: [{
              meta: {
                'concept-id': 'CD100000-EDSC',
                'concept-type': 'collection-draft',
                deleted: false,
                'native-id': 'test-guid',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-27T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                ShortName: 'Test Draft'
              }
            }, {
              meta: {
                'concept-id': 'CD100001-EDSC',
                'concept-type': 'collection-draft',
                deleted: false,
                'native-id': 'test-guid-1',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-29T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                ShortName: 'Test Draft 2'
              }
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Collection',
              ummVersion: '1.0.0'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              count
              items {
                conceptId
                previewMetadata {
                  ... on Collection {
                    conceptId
                    shortName
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
            count: 2,
            items: [{
              conceptId: 'CD100000-EDSC',
              previewMetadata: {
                conceptId: 'CD100000-EDSC',
                shortName: 'Test Draft'
              }
            }, {
              conceptId: 'CD100001-EDSC',
              previewMetadata: {
                conceptId: 'CD100001-EDSC',
                shortName: 'Test Draft 2'
              }
            }]
          }
        })
      })

      describe('draft', () => {
        describe('with results', () => {
          test('returns results', async () => {
            nock(/example-cmr/)
              .defaultReplyHeaders({
                'CMR-Hits': 1,
                'CMR-Took': 7,
                'CMR-Request-Id': 'abcd-1234-efgh-5678'
              })
              .post(/collection-drafts\.json/, 'concept_id=CD100000-EDSC')
              .reply(200, {
                items: [{
                  concept_id: 'CD100000-EDSC'
                }]
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  conceptId: 'CD100000-EDSC',
                  conceptType: 'Collection'
                }
              },
              query: `query Draft($params: DraftInput) {
                draft(params: $params) {
                  conceptId
                }
              }`
            }, {
              contextValue
            })

            const { data } = response.body.singleResult

            expect(data).toEqual({
              draft: {
                conceptId: 'CD100000-EDSC'
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
              .post(/collection-drafts\.json/, 'concept_id=CD100000-EDSC')
              .reply(200, {
                items: []
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  conceptId: 'CD100000-EDSC',
                  conceptType: 'Collection'
                }
              },
              query: `query Draft($params: DraftInput) {
                draft(params: $params) {
                  conceptId
                }
              }`
            }, {
              contextValue
            })

            const { data } = response.body.singleResult

            expect(data).toEqual({
              draft: null
            })
          })
        })
      })
    })

    describe('Mutation', () => {
      describe('ingestDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/providers\/EDSC\/collection-drafts\/collection-1/)
            .reply(201, {
              'concept-id': 'CD100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              conceptType: 'Collection',
              metadata: {
                Name: 'Mock Collection',
                LongName: 'Long Collection Name'
              },
              nativeId: 'collection-1',
              providerId: 'EDSC',
              ummVersion: '1.0.0'
            },
            query: `mutation IngestDraft(
              $conceptType: DraftConceptType!
              $metadata: JSON!
              $nativeId: String!
              $providerId: String!
              $ummVersion: String!
            ) {
              ingestDraft(
                conceptType: $conceptType
                metadata: $metadata
                nativeId: $nativeId
                providerId: $providerId
                ummVersion: $ummVersion
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            ingestDraft: {
              conceptId: 'CD100000-EDSC',
              revisionId: '1',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })

      describe('deleteDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .delete(/ingest\/providers\/EDSC\/collection-drafts\/collection-1/)
            .reply(201, {
              'concept-id': 'CD100000-EDSC',
              'revision-id': '2'
            })

          const response = await server.executeOperation({
            variables: {
              conceptType: 'Collection',
              nativeId: 'collection-1',
              providerId: 'EDSC'
            },
            query: `mutation DeleteDraft(
              $conceptType: DraftConceptType!
              $nativeId: String!
              $providerId: String!
            ) {
              deleteDraft(
                conceptType: $conceptType
                nativeId: $nativeId
                providerId: $providerId
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            deleteDraft: {
              conceptId: 'CD100000-EDSC',
              revisionId: '2',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })

      describe('publishDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/publish\/CD100000-EDSC\/collection-1/)
            .reply(201, {
              'concept-id': 'C100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              draftConceptId: 'CD100000-EDSC',
              nativeId: 'collection-1',
              ummVersion: '1.0.0'
            },
            query: `mutation PublishDraft(
              $draftConceptId: String!
              $nativeId: String!
              $ummVersion: String!
            ) {
              publishDraft(
                draftConceptId: $draftConceptId
                nativeId: $nativeId
                ummVersion: $ummVersion
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            publishDraft: {
              conceptId: 'C100000-EDSC',
              revisionId: '1',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })
    })
  })

  describe('Service drafts', () => {
    describe('Query', () => {
      test('all draft fields', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/service-drafts\.umm_json/)
          .reply(200, {
            hits: 1,
            items: [{
              meta: {
                'concept-id': 'SD100000-EDSC',
                'concept-type': 'service-draft',
                deleted: false,
                'native-id': 'test-guid',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-27T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft'
              }
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'SD100000-EDSC',
              conceptType: 'Service'
            }
          },
          query: `query Draft($params: DraftInput) {
            draft(params: $params) {
              conceptId
              conceptType
              deleted
              name
              nativeId
              providerId
              revisionDate
              revisionId
              ummMetadata
              previewMetadata {
                ... on Service {
                  conceptId
                  name
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          draft: {
            conceptId: 'SD100000-EDSC',
            conceptType: 'service-draft',
            deleted: false,
            previewMetadata: {
              conceptId: 'SD100000-EDSC',
              name: 'Test Draft'
            },
            name: 'Test Draft',
            nativeId: 'test-guid',
            providerId: 'EDSC',
            revisionDate: '2022-05-27T15:18:00.920Z',
            revisionId: '1',
            ummMetadata: {
              Name: 'Test Draft'
            }
          }
        })
      })

      test('drafts', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/service-drafts\.umm_json/)
          .reply(200, {
            hits: 2,
            items: [{
              meta: {
                'concept-id': 'SD100000-EDSC',
                'concept-type': 'service-draft',
                deleted: false,
                'native-id': 'test-guid',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-27T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft'
              }
            }, {
              meta: {
                'concept-id': 'SD100001-EDSC',
                'concept-type': 'service-draft',
                deleted: false,
                'native-id': 'test-guid-1',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-29T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft 2'
              }
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptType: 'Service'
            }
          },
          query: `query Drafts($params: DraftsInput) {
            drafts(params: $params) {
              count
              items {
                conceptId
                previewMetadata {
                  ... on Service {
                    conceptId
                    name
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
            count: 2,
            items: [{
              conceptId: 'SD100000-EDSC',
              previewMetadata: {
                conceptId: 'SD100000-EDSC',
                name: 'Test Draft'
              }
            }, {
              conceptId: 'SD100001-EDSC',
              previewMetadata: {
                conceptId: 'SD100001-EDSC',
                name: 'Test Draft 2'
              }
            }]
          }
        })
      })

      describe('draft', () => {
        describe('with results', () => {
          test('returns results', async () => {
            nock(/example-cmr/)
              .defaultReplyHeaders({
                'CMR-Hits': 1,
                'CMR-Took': 7,
                'CMR-Request-Id': 'abcd-1234-efgh-5678'
              })
              .post(/service-drafts\.json/, 'concept_id=SD100000-EDSC')
              .reply(200, {
                items: [{
                  concept_id: 'SD100000-EDSC'
                }]
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  conceptId: 'SD100000-EDSC',
                  conceptType: 'Service'
                }
              },
              query: `query Draft($params: DraftInput) {
                draft(params: $params) {
                  conceptId
                }
              }`
            }, {
              contextValue
            })

            const { data } = response.body.singleResult

            expect(data).toEqual({
              draft: {
                conceptId: 'SD100000-EDSC'
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
              .post(/service-drafts\.json/, 'concept_id=SD100000-EDSC')
              .reply(200, {
                items: []
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  conceptId: 'SD100000-EDSC',
                  conceptType: 'Service'
                }
              },
              query: `query Draft($params: DraftInput) {
                draft(params: $params) {
                  conceptId
                }
              }`
            }, {
              contextValue
            })

            const { data } = response.body.singleResult

            expect(data).toEqual({
              draft: null
            })
          })
        })
      })
    })

    describe('Mutation', () => {
      describe('ingestDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/providers\/EDSC\/service-drafts\/service-1/)
            .reply(201, {
              'concept-id': 'SD100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              conceptType: 'Service',
              metadata: {
                Name: 'Mock Service',
                LongName: 'Long Service Name'
              },
              nativeId: 'service-1',
              providerId: 'EDSC',
              ummVersion: '1.0.0'
            },
            query: `mutation IngestDraft(
              $conceptType: DraftConceptType!
              $metadata: JSON!
              $nativeId: String!
              $providerId: String!
              $ummVersion: String!
            ) {
              ingestDraft(
                conceptType: $conceptType
                metadata: $metadata
                nativeId: $nativeId
                providerId: $providerId
                ummVersion: $ummVersion
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            ingestDraft: {
              conceptId: 'SD100000-EDSC',
              revisionId: '1',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })

      describe('deleteDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .delete(/ingest\/providers\/EDSC\/service-drafts\/service-1/)
            .reply(201, {
              'concept-id': 'SD100000-EDSC',
              'revision-id': '2'
            })

          const response = await server.executeOperation({
            variables: {
              conceptType: 'Service',
              nativeId: 'service-1',
              providerId: 'EDSC'
            },
            query: `mutation DeleteDraft(
              $conceptType: DraftConceptType!
              $nativeId: String!
              $providerId: String!
            ) {
              deleteDraft(
                conceptType: $conceptType
                nativeId: $nativeId
                providerId: $providerId
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            deleteDraft: {
              conceptId: 'SD100000-EDSC',
              revisionId: '2',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })

      describe('publishDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/publish\/SD100000-EDSC\/service-1/)
            .reply(201, {
              'concept-id': 'S100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              draftConceptId: 'SD100000-EDSC',
              nativeId: 'service-1',
              ummVersion: '1.0.0'
            },
            query: `mutation PublishDraft(
              $draftConceptId: String!
              $nativeId: String!
              $ummVersion: String!
            ) {
              publishDraft(
                draftConceptId: $draftConceptId
                nativeId: $nativeId
                ummVersion: $ummVersion
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            publishDraft: {
              conceptId: 'S100000-EDSC',
              revisionId: '1',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })
    })
  })

  describe('Tool drafts', () => {
    describe('Query', () => {
      test('all draft fields', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/tool-drafts\.umm_json/)
          .reply(200, {
            hits: 1,
            items: [{
              meta: {
                'concept-id': 'TD100000-EDSC',
                'concept-type': 'tool-draft',
                deleted: false,
                'native-id': 'test-guid',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-27T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft'
              }
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'TD100000-EDSC',
              conceptType: 'Tool'
            }
          },
          query: `query Draft($params: DraftInput) {
            draft(params: $params) {
              conceptId
              conceptType
              deleted
              name
              nativeId
              providerId
              revisionDate
              revisionId
              ummMetadata
              previewMetadata {
                ... on Tool {
                  conceptId
                  name
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          draft: {
            conceptId: 'TD100000-EDSC',
            conceptType: 'tool-draft',
            deleted: false,
            previewMetadata: {
              conceptId: 'TD100000-EDSC',
              name: 'Test Draft'
            },
            name: 'Test Draft',
            nativeId: 'test-guid',
            providerId: 'EDSC',
            revisionDate: '2022-05-27T15:18:00.920Z',
            revisionId: '1',
            ummMetadata: {
              Name: 'Test Draft'
            }
          }
        })
      })

      test('drafts', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/tool-drafts\.umm_json/)
          .reply(200, {
            hits: 2,
            items: [{
              meta: {
                'concept-id': 'TD100000-EDSC',
                'concept-type': 'tool-draft',
                deleted: false,
                'native-id': 'test-guid',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-27T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft'
              }
            }, {
              meta: {
                'concept-id': 'TD100001-EDSC',
                'concept-type': 'tool-draft',
                deleted: false,
                'native-id': 'test-guid-1',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-29T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft 2'
              }
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
              count
              items {
                conceptId
                previewMetadata {
                  ... on Tool {
                    conceptId
                    name
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
            count: 2,
            items: [{
              conceptId: 'TD100000-EDSC',
              previewMetadata: {
                conceptId: 'TD100000-EDSC',
                name: 'Test Draft'
              }
            }, {
              conceptId: 'TD100001-EDSC',
              previewMetadata: {
                conceptId: 'TD100001-EDSC',
                name: 'Test Draft 2'
              }
            }]
          }
        })
      })

      describe('draft', () => {
        describe('with results', () => {
          test('returns results', async () => {
            nock(/example-cmr/)
              .defaultReplyHeaders({
                'CMR-Hits': 1,
                'CMR-Took': 7,
                'CMR-Request-Id': 'abcd-1234-efgh-5678'
              })
              .post(/tool-drafts\.json/, 'concept_id=TD100000-EDSC')
              .reply(200, {
                items: [{
                  concept_id: 'TD100000-EDSC'
                }]
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  conceptId: 'TD100000-EDSC',
                  conceptType: 'Tool'
                }
              },
              query: `query Draft($params: DraftInput) {
                draft(params: $params) {
                  conceptId
                }
              }`
            }, {
              contextValue
            })

            const { data } = response.body.singleResult

            expect(data).toEqual({
              draft: {
                conceptId: 'TD100000-EDSC'
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
              .post(/tool-drafts\.json/, 'concept_id=TD100000-EDSC')
              .reply(200, {
                items: []
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  conceptId: 'TD100000-EDSC',
                  conceptType: 'Tool'
                }
              },
              query: `query Draft($params: DraftInput) {
                draft(params: $params) {
                  conceptId
                }
              }`
            }, {
              contextValue
            })

            const { data } = response.body.singleResult

            expect(data).toEqual({
              draft: null
            })
          })
        })
      })
    })

    describe('Mutation', () => {
      describe('ingestDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/providers\/EDSC\/tool-drafts\/tool-1/)
            .reply(201, {
              'concept-id': 'TD100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              conceptType: 'Tool',
              metadata: {
                Name: 'Mock Tool',
                LongName: 'Long Tool Name'
              },
              nativeId: 'tool-1',
              providerId: 'EDSC',
              ummVersion: '1.0.0'
            },
            query: `mutation IngestDraft(
              $conceptType: DraftConceptType!
              $metadata: JSON!
              $nativeId: String!
              $providerId: String!
              $ummVersion: String!
            ) {
              ingestDraft(
                conceptType: $conceptType
                metadata: $metadata
                nativeId: $nativeId
                providerId: $providerId
                ummVersion: $ummVersion
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            ingestDraft: {
              conceptId: 'TD100000-EDSC',
              revisionId: '1',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })

      describe('deleteDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .delete(/ingest\/providers\/EDSC\/tool-drafts\/tool-1/)
            .reply(201, {
              'concept-id': 'TD100000-EDSC',
              'revision-id': '2'
            })

          const response = await server.executeOperation({
            variables: {
              conceptType: 'Tool',
              nativeId: 'tool-1',
              providerId: 'EDSC'
            },
            query: `mutation DeleteDraft(
              $conceptType: DraftConceptType!
              $nativeId: String!
              $providerId: String!
            ) {
              deleteDraft(
                conceptType: $conceptType
                nativeId: $nativeId
                providerId: $providerId
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            deleteDraft: {
              conceptId: 'TD100000-EDSC',
              revisionId: '2',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })

      describe('publishDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/publish\/TD100000-EDSC\/tool-1/)
            .reply(201, {
              'concept-id': 'T100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              draftConceptId: 'TD100000-EDSC',
              nativeId: 'tool-1',
              ummVersion: '1.0.0'
            },
            query: `mutation PublishDraft(
              $draftConceptId: String!
              $nativeId: String!
              $ummVersion: String!
            ) {
              publishDraft(
                draftConceptId: $draftConceptId
                nativeId: $nativeId
                ummVersion: $ummVersion
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            publishDraft: {
              conceptId: 'T100000-EDSC',
              revisionId: '1',
              warnings: null,
              existingErrors: null
            }
          })
        })

        test('returns the cmr result when collection concept provided but not needed', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/publish\/TD100000-EDSC\/tool-1/)
            .reply(201, {
              'concept-id': 'T100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              draftConceptId: 'TD100000-EDSC',
              nativeId: 'tool-1',
              ummVersion: '1.0.0',
              collectionConceptId: 'C100000-EDSC'
            },
            query: `mutation PublishDraft(
                    $draftConceptId: String!
                    $nativeId: String!
                    $ummVersion: String!
                    $collectionConceptId: String
                  ) {
                    publishDraft(
                      draftConceptId: $draftConceptId
                      nativeId: $nativeId
                      ummVersion: $ummVersion
                      collectionConceptId: $collectionConceptId
                    ) {
                      conceptId
                      revisionId
                      warnings
                      existingErrors
                    }
                  }`
          }, {
            contextValue
          })
          const { data } = response.body.singleResult

          expect(data).toEqual({ publishDraft: null })
        })
      })
    })
  })

  describe('Variable drafts', () => {
    describe('Query', () => {
      test('all draft fields', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 1,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/variable-drafts\.umm_json/)
          .reply(200, {
            hits: 1,
            items: [{
              meta: {
                'concept-id': 'VD100000-EDSC',
                'concept-type': 'variable-draft',
                deleted: false,
                'native-id': 'test-guid',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-27T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft'
              }
            }]
          })

        const response = await server.executeOperation({
          variables: {
            params: {
              conceptId: 'VD100000-EDSC',
              conceptType: 'Variable'
            }
          },
          query: `query Draft($params: DraftInput) {
            draft(params: $params) {
              conceptId
              conceptType
              deleted
              name
              nativeId
              providerId
              revisionDate
              revisionId
              ummMetadata
              previewMetadata {
                ... on Variable {
                  conceptId
                  name
                }
              }
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          draft: {
            conceptId: 'VD100000-EDSC',
            conceptType: 'variable-draft',
            deleted: false,
            previewMetadata: {
              conceptId: 'VD100000-EDSC',
              name: 'Test Draft'
            },
            name: 'Test Draft',
            nativeId: 'test-guid',
            providerId: 'EDSC',
            revisionDate: '2022-05-27T15:18:00.920Z',
            revisionId: '1',
            ummMetadata: {
              Name: 'Test Draft'
            }
          }
        })
      })

      test('drafts', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 2,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/variable-drafts\.umm_json/)
          .reply(200, {
            hits: 2,
            items: [{
              meta: {
                'concept-id': 'VD100000-EDSC',
                'concept-type': 'variable-draft',
                deleted: false,
                'native-id': 'test-guid',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-27T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft'
              }
            }, {
              meta: {
                'concept-id': 'VD100001-EDSC',
                'concept-type': 'variable-draft',
                deleted: false,
                'native-id': 'test-guid-1',
                'provider-id': 'EDSC',
                'revision-date': '2022-05-29T15:18:00.920Z',
                'revision-id': '1'
              },
              umm: {
                Name: 'Test Draft 2'
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
              count
              items {
                conceptId
                previewMetadata {
                  ... on Variable {
                    conceptId
                    name
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
            count: 2,
            items: [{
              conceptId: 'VD100000-EDSC',
              previewMetadata: {
                conceptId: 'VD100000-EDSC',
                name: 'Test Draft'
              }
            }, {
              conceptId: 'VD100001-EDSC',
              previewMetadata: {
                conceptId: 'VD100001-EDSC',
                name: 'Test Draft 2'
              }
            }]
          }
        })
      })

      describe('draft', () => {
        describe('with results', () => {
          test('returns results', async () => {
            nock(/example-cmr/)
              .defaultReplyHeaders({
                'CMR-Hits': 1,
                'CMR-Took': 7,
                'CMR-Request-Id': 'abcd-1234-efgh-5678'
              })
              .post(/variable-drafts\.json/, 'concept_id=VD100000-EDSC')
              .reply(200, {
                items: [{
                  concept_id: 'VD100000-EDSC'
                }]
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  conceptId: 'VD100000-EDSC',
                  conceptType: 'Variable'
                }
              },
              query: `query Draft($params: DraftInput) {
                draft(params: $params) {
                  conceptId
                }
              }`
            }, {
              contextValue
            })

            const { data } = response.body.singleResult

            expect(data).toEqual({
              draft: {
                conceptId: 'VD100000-EDSC'
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
              .post(/variable-drafts\.json/, 'concept_id=VD100000-EDSC')
              .reply(200, {
                items: []
              })

            const response = await server.executeOperation({
              variables: {
                params: {
                  conceptId: 'VD100000-EDSC',
                  conceptType: 'Variable'
                }
              },
              query: `query Draft($params: DraftInput) {
                draft(params: $params) {
                  conceptId
                }
              }`
            }, {
              contextValue
            })

            const { data } = response.body.singleResult

            expect(data).toEqual({
              draft: null
            })
          })
        })
      })
    })

    describe('Mutation', () => {
      describe('ingestDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/providers\/EDSC\/variable-drafts\/variable-1/)
            .reply(201, {
              'concept-id': 'VD100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              conceptType: 'Variable',
              metadata: {
                Name: 'Mock Variable',
                LongName: 'Long Variable Name'
              },
              nativeId: 'variable-1',
              providerId: 'EDSC',
              ummVersion: '1.0.0'
            },
            query: `mutation IngestDraft(
              $conceptType: DraftConceptType!
              $metadata: JSON!
              $nativeId: String!
              $providerId: String!
              $ummVersion: String!
            ) {
              ingestDraft(
                conceptType: $conceptType
                metadata: $metadata
                nativeId: $nativeId
                providerId: $providerId
                ummVersion: $ummVersion
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            ingestDraft: {
              conceptId: 'VD100000-EDSC',
              revisionId: '1',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })

      describe('deleteDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .delete(/ingest\/providers\/EDSC\/variable-drafts\/variable-1/)
            .reply(201, {
              'concept-id': 'VD100000-EDSC',
              'revision-id': '2'
            })

          const response = await server.executeOperation({
            variables: {
              conceptType: 'Variable',
              nativeId: 'variable-1',
              providerId: 'EDSC'
            },
            query: `mutation DeleteDraft(
              $conceptType: DraftConceptType!
              $nativeId: String!
              $providerId: String!
            ) {
              deleteDraft(
                conceptType: $conceptType
                nativeId: $nativeId
                providerId: $providerId
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            deleteDraft: {
              conceptId: 'VD100000-EDSC',
              revisionId: '2',
              warnings: null,
              existingErrors: null
            }
          })
        })
      })

      describe('publishDraft', () => {
        test('returns the cmr result', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/publish\/VD100000-EDSC\/variable-1/)
            .reply(201, {
              'concept-id': 'V100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              draftConceptId: 'VD100000-EDSC',
              nativeId: 'variable-1',
              ummVersion: '1.0.0',
              collectionConceptId: 'C100000-EDSC'
            },
            query: `mutation PublishDraft(
              $draftConceptId: String!
              $nativeId: String!
              $ummVersion: String!
              $collectionConceptId: String
            ) {
              publishDraft(
                draftConceptId: $draftConceptId
                nativeId: $nativeId
                ummVersion: $ummVersion
                collectionConceptId: $collectionConceptId
              ) {
                conceptId
                revisionId
                warnings
                existingErrors
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            publishDraft: {
              conceptId: 'V100000-EDSC',
              revisionId: '1',
              warnings: null,
              existingErrors: null
            }
          })
        })

        test('returns the cmr result when collection concept not provided', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'client-id': 'eed-test-graphql',
              'content-type': 'application/vnd.nasa.cmr.umm+json; version=1.0.0',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .put(/ingest\/publish\/VD100000-EDSC\/variable-1/)
            .reply(201, {
              'concept-id': 'V100000-EDSC',
              'revision-id': '1'
            })

          const response = await server.executeOperation({
            variables: {
              draftConceptId: 'VD100000-EDSC',
              nativeId: 'variable-1',
              ummVersion: '1.0.0'
            },
            query: `mutation PublishDraft(
                    $draftConceptId: String!
                    $nativeId: String!
                    $ummVersion: String!
                  ) {
                    publishDraft(
                      draftConceptId: $draftConceptId
                      nativeId: $nativeId
                      ummVersion: $ummVersion
                    ) {
                      conceptId
                      revisionId
                      warnings
                      existingErrors
                    }
                  }`
          }, {
            contextValue
          })
          const { data } = response.body.singleResult

          expect(data).toEqual({ publishDraft: null })
        })
      })
    })
  })

  describe('PreviewMetadata', () => {
    describe('__resolveType', () => {
      test('returns Collection when the conceptId starts with CD', () => {
        const { PreviewMetadata: previewMetadata } = resolvers
        const { __resolveType: resolveType } = previewMetadata

        const result = resolveType({ conceptId: 'CD' })
        expect(result).toEqual('Collection')
      })

      test('returns Service when the conceptId starts with SD', () => {
        const { PreviewMetadata: previewMetadata } = resolvers
        const { __resolveType: resolveType } = previewMetadata

        const result = resolveType({ conceptId: 'SD' })
        expect(result).toEqual('Service')
      })

      test('returns Tool when the conceptId starts with TD', () => {
        const { PreviewMetadata: previewMetadata } = resolvers
        const { __resolveType: resolveType } = previewMetadata

        const result = resolveType({ conceptId: 'TD' })
        expect(result).toEqual('Tool')
      })

      test('returns Variable when the conceptId starts with VD', () => {
        const { PreviewMetadata: previewMetadata } = resolvers
        const { __resolveType: resolveType } = previewMetadata

        const result = resolveType({ conceptId: 'VD' })
        expect(result).toEqual('Variable')
      })

      test('returns null when the conceptId is not a draft', () => {
        const { PreviewMetadata: previewMetadata } = resolvers
        const { __resolveType: resolveType } = previewMetadata

        const result = resolveType({ conceptId: 'something-bad' })
        expect(result).toEqual(null)
      })
    })
  })
})
