import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Association', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Mutation', () => {
    describe('createAssociation', () => {
      describe('when using associatedConceptId to associate a single concept', () => {
        test('returns one association', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'content-type': 'application/json',
              'client-id': 'eed-test-graphql',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/search\/associate\/C10000000-CMR/)
            .reply(201, [
              {
                generic_association: {
                  concept_id: 'GA10000000-CMR',
                  revision_id: 1
                },
                associated_item: {
                  concept_id: 'OO10000000-CMR'
                }
              }])

          const response = await server.executeOperation({
            variables: {
              conceptId: 'C10000000-CMR',
              associatedConceptId: 'OO10000000-CMR'
            },
            query: `mutation CreateAssociation(
              $conceptId: String!
              $associatedConceptId: String
            ) {
              createAssociation(
                conceptId: $conceptId
                associatedConceptId: $associatedConceptId
              ) {
                conceptId
                revisionId
                associatedConceptId
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createAssociation: [{
              conceptId: 'GA10000000-CMR',
              revisionId: 1,
              associatedConceptId: 'OO10000000-CMR'
            }]
          })
        })
      })

      describe('when using associatedConceptIds to associate multiple concepts', () => {
        test('returns multiple associations', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'content-type': 'application/json',
              'client-id': 'eed-test-graphql',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/search\/associate\/C10000000-CMR/)
            .reply(201, [
              {
                generic_association: {
                  concept_id: 'GA10000000-CMR',
                  revision_id: 1
                },
                associated_item: {
                  concept_id: 'OO10000000-CMR'
                }
              }, {
                generic_association: {
                  concept_id: 'GA10000001-CMR',
                  revision_id: 1
                },
                associated_item: {
                  concept_id: 'OO10000001-CMR'
                }
              }])

          const response = await server.executeOperation({
            variables: {
              conceptId: 'C10000000-CMR',
              associatedConceptIds: ['OO10000000-CMR', 'OO10000001-CMR']
            },
            query: `mutation CreateAssociation(
              $conceptId: String!
              $associatedConceptIds: [String]
            ) {
              createAssociation(
                conceptId: $conceptId
                associatedConceptIds: $associatedConceptIds
              ) {
                conceptId
                revisionId
                associatedConceptId
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createAssociation: [{
              conceptId: 'GA10000000-CMR',
              revisionId: 1,
              associatedConceptId: 'OO10000000-CMR'
            }, {
              conceptId: 'GA10000001-CMR',
              revisionId: 1,
              associatedConceptId: 'OO10000001-CMR'
            }]
          })
        })
      })

      describe('when using associatedConcepts to associate multiple concepts with data', () => {
        test('returns multiple associations', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'content-type': 'application/json',
              'client-id': 'eed-test-graphql',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/search\/associate\/C10000000-CMR/)
            .reply(201, [
              {
                generic_association: {
                  concept_id: 'GA10000000-CMR',
                  revision_id: 1
                },
                associated_item: {
                  concept_id: 'OO10000000-CMR'
                }
              }, {
                generic_association: {
                  concept_id: 'GA10000001-CMR',
                  revision_id: 1
                },
                associated_item: {
                  concept_id: 'OO10000001-CMR'
                }
              }])

          const response = await server.executeOperation({
            variables: {
              conceptId: 'C10000000-CMR',
              associatedConceptData: [{
                concept_id: 'OO10000000-CMR',
                data: { test: true }
              }, {
                concept_id: 'OO10000001-CMR'
              }]
            },
            query: `mutation CreateAssociation(
              $conceptId: String!
              $associatedConceptData: JSON
            ) {
              createAssociation(
                conceptId: $conceptId
                associatedConceptData: $associatedConceptData
              ) {
                conceptId
                revisionId
                associatedConceptId
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createAssociation: [{
              conceptId: 'GA10000000-CMR',
              revisionId: 1,
              associatedConceptId: 'OO10000000-CMR'
            }, {
              conceptId: 'GA10000001-CMR',
              revisionId: 1,
              associatedConceptId: 'OO10000001-CMR'
            }]
          })
        })
      })
    })

    describe('deleteAssociation', () => {
      describe('when using associatedConceptId to associate a single concept', () => {
        test('returns one association', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'content-type': 'application/json',
              'client-id': 'eed-test-graphql',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .delete(/search\/associate\/C10000000-CMR/)
            .reply(201, [
              {
                generic_association: {
                  concept_id: 'GA10000000-CMR',
                  revision_id: 1
                },
                associated_item: {
                  concept_id: 'OO10000000-CMR'
                }
              }])

          const response = await server.executeOperation({
            variables: {
              conceptId: 'C10000000-CMR',
              associatedConceptId: 'OO10000000-CMR'
            },
            query: `mutation DeleteAssociation(
              $conceptId: String!
              $associatedConceptId: String
            ) {
              deleteAssociation(
                conceptId: $conceptId
                associatedConceptId: $associatedConceptId
              ) {
                conceptId
                revisionId
                associatedConceptId
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            deleteAssociation: [{
              conceptId: 'GA10000000-CMR',
              revisionId: 1,
              associatedConceptId: 'OO10000000-CMR'
            }]
          })
        })
      })

      describe('when using associatedConceptIds to associate multiple concepts', () => {
        test('returns multiple associations', async () => {
          nock(/example-cmr/, {
            reqheaders: {
              accept: 'application/json',
              'content-type': 'application/json',
              'client-id': 'eed-test-graphql',
              'cmr-request-id': 'abcd-1234-efgh-5678'
            }
          })
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .delete(/search\/associate\/C10000000-CMR/)
            .reply(201, [
              {
                generic_association: {
                  concept_id: 'GA10000000-CMR',
                  revision_id: 1
                },
                associated_item: {
                  concept_id: 'OO10000000-CMR'
                }
              }, {
                generic_association: {
                  concept_id: 'GA10000001-CMR',
                  revision_id: 1
                },
                associated_item: {
                  concept_id: 'OO10000001-CMR'
                }
              }])

          const response = await server.executeOperation({
            variables: {
              conceptId: 'C10000000-CMR',
              associatedConceptIds: ['OO10000000-CMR', 'OO10000001-CMR']
            },
            query: `mutation DeleteAssociation(
              $conceptId: String!
              $associatedConceptIds: [String]
            ) {
              deleteAssociation(
                conceptId: $conceptId
                associatedConceptIds: $associatedConceptIds
              ) {
                conceptId
                revisionId
                associatedConceptId
              }
            }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            deleteAssociation: [{
              conceptId: 'GA10000000-CMR',
              revisionId: 1,
              associatedConceptId: 'OO10000000-CMR'
            }, {
              conceptId: 'GA10000001-CMR',
              revisionId: 1,
              associatedConceptId: 'OO10000001-CMR'
            }]
          })
        })
      })
    })
  })
})
