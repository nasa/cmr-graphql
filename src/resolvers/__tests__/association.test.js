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
      test('returns the cmr results', async () => {
        nock(/example-cmr/, {
          reqheaders: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'client-id': 'eed-test-graphql',
            'cmr-request-id': 'abcd-1234-efgh-5678'
          }
        })
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/search\/tools\/T12000000\/associations/)
          .reply(201, [{
            tool_association: {
              concept_id: 'TLA12000000-CMR',
              revision_id: 1
            },
            associated_item: { concept_id: 'C12000000' }
          }])

        const response = await server.executeOperation({
          variables: {
            conceptId: 'T12000000',
            collectionConceptIds: [
              {
                conceptId: 'C12000000'
              }
            ],
            conceptType: 'Tool'
          },
          query: `mutation CreateAssociation(
            $conceptId: String!
            $collectionConceptIds: [JSON]!
            $conceptType: ConceptType!
          ) {
            createAssociation(
              conceptId: $conceptId
              collectionConceptIds: $collectionConceptIds
              conceptType: $conceptType
            ) {
              associatedItem
              toolAssociation
            }
          }`
        }, {
          contextValue
        })
        const { data } = response.body.singleResult
        expect(data).toEqual({
          createAssociation: {
            associatedItem: { concept_id: 'C12000000' },
            toolAssociation: {
              concept_id: 'TLA12000000-CMR',
              revision_id: 1
            }
          }
        })
      })

      test('returns an error when Metadata or NativeId are provided', async () => {
        nock(/example-cmr/, {
          reqheaders: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'client-id': 'eed-test-graphql',
            'cmr-request-id': 'abcd-1234-efgh-5678'
          }
        })
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/search\/tools\/T12000000\/associations/)
          .reply(201, [{
            tool_association: {
              concept_id: 'TLA12000000-CMR',
              revision_id: 1
            },
            associated_item: { concept_id: 'C12000000' }
          }])

        const response = await server.executeOperation({
          variables: {
            conceptId: 'T12000000',
            collectionConceptIds: [
              {
                conceptId: 'C12000000'
              }
            ],
            conceptType: 'Tool',
            nativeId: 'Variable-1',
            metadata: {}
          },
          query: `mutation CreateAssociation(
            $conceptId: String!
            $collectionConceptIds: [JSON]!
            $conceptType: ConceptType!
            $nativeId: String
            $metadata: JSON
          ) {
            createAssociation(
              conceptId: $conceptId
              collectionConceptIds: $collectionConceptIds
              conceptType: $conceptType
              nativeId: $nativeId
              metadata: $metadata
            ) {
              associatedItem
              toolAssociation
            }
          }`
        }, {
          contextValue
        })

        const { errors } = response.body.singleResult
        const { message } = errors[0]

        expect(message).toEqual('nativeId or metadata are invalid fields. When creating a Tool or Service Association, nativeId and metadata are not valid field')
      })
    })

    describe('createVariableAssociation', () => {
      test('returns the cmr results', async () => {
        nock(/example-cmr/, {
          reqheaders: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/vnd.nasa.cmr.umm+json',
            'client-id': 'eed-test-graphql',
            'cmr-request-id': 'abcd-1234-efgh-5678'
          }
        })
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .put(/ingest\/collections\/C12000000\/variables\/variable-1/)
          .reply(200, {
            'variable-association': {
              'concept-id': 'VA1200000007-CMR',
              'revision-id': 1
            }
          })

        const response = await server.executeOperation({
          variables: {
            conceptId: 'V120000000',
            collectionConceptIds: [
              {
                conceptId: 'C12000000'
              }
            ],
            conceptType: 'Variable',
            nativeId: 'variable-1',
            metadata: {
              Name: 'Test Variable',
              LongName: 'mock long name'
            }
          },
          query: `mutation CreateAssociation(
            $conceptId: String!
            $collectionConceptIds: [JSON]!
            $conceptType: ConceptType!
            $nativeId: String
            $metadata: JSON
          ) {
            createAssociation(
              conceptId: $conceptId
              collectionConceptIds: $collectionConceptIds
              conceptType: $conceptType
              nativeId: $nativeId
              metadata: $metadata
            ) {
              variableAssociation
            }
          }`
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          createAssociation: {
            variableAssociation: {
              'concept-id': 'VA1200000007-CMR',
              'revision-id': 1
            }
          }
        })
      })

      test('returns an error when Metadata or NativeId not provided', async () => {
        nock(/example-cmr/, {
          reqheaders: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/vnd.nasa.cmr.umm+json',
            'client-id': 'eed-test-graphql',
            'cmr-request-id': 'abcd-1234-efgh-5678'
          }
        })
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .put(/ingest\/collections\/C12000000\/variables\/variable-1/)
          .reply(200, {
            'variable-association': {
              'concept-id': 'VA1200000007-CMR',
              'revision-id': 1
            }
          })

        const response = await server.executeOperation({
          variables: {
            conceptId: 'V120000000',
            collectionConceptIds: [
              {
                conceptId: 'C12000000'
              }
            ],
            conceptType: 'Variable'
          },
          query: `mutation CreateAssociation(
            $conceptId: String!
            $collectionConceptIds: [JSON]!
            $conceptType: ConceptType!
            $nativeId: String
            $metadata: JSON
          ) {
            createAssociation(
              conceptId: $conceptId
              collectionConceptIds: $collectionConceptIds
              conceptType: $conceptType
              nativeId: $nativeId
              metadata: $metadata
            ) {
              variableAssociation
            }
          }`
        }, {
          contextValue
        })

        const { errors } = response.body.singleResult
        const { message } = errors[0]

        expect(message).toEqual('nativeId and metadata required. When creating a Variable Association, nativeId and metadata are required')
      })
    })

    describe('deleteAssociation', () => {
      test('returns the cmr results', async () => {
        nock(/example-cmr/, {
          reqheaders: {
            accept: 'application/json, text/plain, */*',
            'content-type': 'application/json',
            'client-id': 'eed-test-graphql',
            'cmr-request-id': 'abcd-1234-efgh-5678'
          }
        })
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .delete(/search\/tools\/T12000000\/associations/)
          .reply(201, [{
            tool_association: {
              concept_id: 'TLA12000000-CMR',
              revision_id: 1
            },
            associated_item: { concept_id: 'C12000000' }
          }])

        const response = await server.executeOperation({
          variables: {
            conceptId: 'T12000000',
            collectionConceptIds: [
              {
                conceptId: 'C12000000'
              }
            ],
            conceptType: 'Tool'
          },
          query: `mutation DeleteAssociation(
            $conceptId: String!
            $collectionConceptIds: [JSON]!
            $conceptType: ConceptType!
          ) {
            deleteAssociation(
              conceptId: $conceptId
              collectionConceptIds: $collectionConceptIds
              conceptType: $conceptType
            ) {
              associatedItem
              toolAssociation
            }
          }`
        }, {
          contextValue
        })
        const { data } = response.body.singleResult
        expect(data).toEqual({
          deleteAssociation: {
            associatedItem: { concept_id: 'C12000000' },
            toolAssociation: {
              concept_id: 'TLA12000000-CMR',
              revision_id: 1
            }
          }
        })
      })
    })
  })
})
