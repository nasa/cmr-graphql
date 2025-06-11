import nock from 'nock'

import graphDbAssociatedCitations from '../graphDbAssociatedCitations'
import * as getUserPermittedGroups from '../../utils/getUserPermittedGroups'

import associatedCitationsGraphdbResponseMocks from './__mocks__/associatedCitations.graphDbOnlyFields.graphdbResponse.mocks'
import associatedCitationsResponseMocks from './__mocks__/associatedCitations.graphDbOnlyFields.response.mocks'
import associatedCitationsRelationshipTypeSingleGraphdbResponseMocks from './__mocks__/associatedCitations.relationshipTypeSingle.graphdbResponse.mocks'
import associatedCitationsRelationshipTypeSingleResponseMocks from './__mocks__/associatedCitations.relationshipTypeSingle.response.mocks'
import associatedCitationsRelationshipTypeMultipleGraphdbResponseMocks from './__mocks__/associatedCitations.relationshipTypeMultiple.graphdbResponse.mocks'
import associatedCitationsRelationshipTypeMultipleResponseMocks from './__mocks__/associatedCitations.relationshipTypeMultiple.response.mocks'
import associatedCitationsIdentifierTypeSingleGraphdbResponseMocks from './__mocks__/associatedCitations.identifierTypeSingle.graphdbResponse.mocks'
import associatedCitationsIdentifierTypeSingleResponseMocks from './__mocks__/associatedCitations.identifierTypeSingle.response.mocks'
import associatedCitationsIdentifierTypeMultipleGraphdbResponseMocks from './__mocks__/associatedCitations.identifierTypeMultiple.graphdbResponse.mocks'
import associatedCitationsIdentifierTypeMultipleResponseMocks from './__mocks__/associatedCitations.identifierTypeMultiple.response.mocks'
import associatedCitationsProviderIdSingleGraphdbResponseMocks from './__mocks__/associatedCitations.providerIdSingle.graphdbResponse.mocks'
import associatedCitationsProviderIdSingleResponseMocks from './__mocks__/associatedCitations.providerIdSingle.response.mocks'
import associatedCitationsProviderIdMultipleGraphdbResponseMocks from './__mocks__/associatedCitations.providerIdMultiple.graphdbResponse.mocks'
import associatedCitationsProviderIdMultipleResponseMocks from './__mocks__/associatedCitations.providerIdMultiple.response.mocks'
import associatedCitationsDepth2GraphdbResponseMocks from './__mocks__/associatedCitations.depth2.graphdbResponse.mocks'
import associatedCitationsDepth2ResponseMocks from './__mocks__/associatedCitations.depth2.response.mocks'
import associatedCitationsPaginationGraphdbResponseMocks from './__mocks__/associatedCitations.pagination.graphdbResponse.mocks'
import associatedCitationsPaginationResponseMocks from './__mocks__/associatedCitations.pagination.response.mocks'

let parsedInfo

describe('graphDbAssociatedCitations', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }
    process.env.ursRootUrl = 'http://example-urs.com'
    process.env.edlClientId = 'edl-client-id'
    process.env.graphdbHost = 'http://example-graphdb.com'
    process.env.graphdbPort = '8182'
    process.env.graphdbPath = ''
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when associated citations are requested', () => {
    beforeEach(() => {
      parsedInfo = {
        fieldsByTypeName: {
          CitationList: {
            items: {
              fieldsByTypeName: {
                Citation: {
                  associationLevel: {
                    name: 'associationLevel',
                    alias: 'associationLevel',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  relationshipType: {
                    name: 'relationshipType',
                    alias: 'relationshipType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifier: {
                    name: 'identifier',
                    alias: 'identifier',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifierType: {
                    name: 'identifierType',
                    alias: 'identifierType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  name: {
                    name: 'name',
                    alias: 'name',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  title: {
                    name: 'title',
                    alias: 'title',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  abstract: {
                    name: 'abstract',
                    alias: 'abstract',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  providerId: {
                    name: 'providerId',
                    alias: 'providerId',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns citations', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('.range(0, 1)')
        })
        .reply(200, associatedCitationsGraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        { limit: 1 },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsResponseMocks)
    })
  })

  describe('when relationshipType filtering is used', () => {
    beforeEach(() => {
      parsedInfo = {
        fieldsByTypeName: {
          CitationList: {
            items: {
              fieldsByTypeName: {
                Citation: {
                  associationLevel: {
                    name: 'associationLevel',
                    alias: 'associationLevel',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  relationshipType: {
                    name: 'relationshipType',
                    alias: 'relationshipType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifier: {
                    name: 'identifier',
                    alias: 'identifier',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifierType: {
                    name: 'identifierType',
                    alias: 'identifierType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  name: {
                    name: 'name',
                    alias: 'name',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  title: {
                    name: 'title',
                    alias: 'title',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  abstract: {
                    name: 'abstract',
                    alias: 'abstract',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns citations filtered by single relationshipType', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('bothE(\'IsIdenticalTo\')')
           && gremlin.includes('.range(0, 1)')
        })
        .reply(200, associatedCitationsRelationshipTypeSingleGraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        {
          limit: 1,
          relationshipType: ['IsIdenticalTo']
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsRelationshipTypeSingleResponseMocks)
    })

    test('returns citations filtered by multiple relationshipTypes', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('bothE(\'IsIdenticalTo\',\'Refers\')')
           && gremlin.includes('.range(0, 1)')
        })
        .reply(200, associatedCitationsRelationshipTypeMultipleGraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        {
          limit: 1,
          relationshipType: ['IsIdenticalTo', 'Refers']
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsRelationshipTypeMultipleResponseMocks)
    })
  })

  describe('when identifierType filtering is used', () => {
    beforeEach(() => {
      parsedInfo = {
        fieldsByTypeName: {
          CitationList: {
            items: {
              fieldsByTypeName: {
                Citation: {
                  associationLevel: {
                    name: 'associationLevel',
                    alias: 'associationLevel',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  relationshipType: {
                    name: 'relationshipType',
                    alias: 'relationshipType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifier: {
                    name: 'identifier',
                    alias: 'identifier',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifierType: {
                    name: 'identifierType',
                    alias: 'identifierType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  name: {
                    name: 'name',
                    alias: 'name',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  title: {
                    name: 'title',
                    alias: 'title',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  abstract: {
                    name: 'abstract',
                    alias: 'abstract',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns citations filtered by single identifierType', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('has(\'identifierType\', \'ISBN\')')
           && gremlin.includes('.range(0, 1)')
        })

        .reply(200, associatedCitationsIdentifierTypeSingleGraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        {
          limit: 1,
          identifierType: 'ISBN'
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsIdentifierTypeSingleResponseMocks)
    })

    test('returns citations filtered by multiple identifierTypes', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('.has(\'identifierType\', within(\'ARK\',\'ISBN\'))')
           && gremlin.includes('.range(0, 1)')
        })
        .reply(200, associatedCitationsIdentifierTypeMultipleGraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        {
          limit: 1,
          identifierType: ['ARK', 'ISBN']
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsIdentifierTypeMultipleResponseMocks)
    })
  })

  describe('when providerId filtering is used', () => {
    beforeEach(() => {
      parsedInfo = {
        fieldsByTypeName: {
          CitationList: {
            items: {
              fieldsByTypeName: {
                Citation: {
                  associationLevel: {
                    name: 'associationLevel',
                    alias: 'associationLevel',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  relationshipType: {
                    name: 'relationshipType',
                    alias: 'relationshipType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifier: {
                    name: 'identifier',
                    alias: 'identifier',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifierType: {
                    name: 'identifierType',
                    alias: 'identifierType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  name: {
                    name: 'name',
                    alias: 'name',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  title: {
                    name: 'title',
                    alias: 'title',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  abstract: {
                    name: 'abstract',
                    alias: 'abstract',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns citations filtered by single providerId', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('.has(\'providerId\', \'PROV2\')')
           && gremlin.includes('.range(0, 1)')
        })
        .reply(200, associatedCitationsProviderIdSingleGraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        {
          limit: 1,
          providerId: 'PROV2'
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsProviderIdSingleResponseMocks)
    })

    test('returns citations filtered by multiple providerIds', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('.has(\'providerId\', within(\'PROV2\',\'PROV3\'))')
           && gremlin.includes('.range(0, 2)')
        })
        .reply(200, associatedCitationsProviderIdMultipleGraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        {
          limit: 2,
          providerId: ['PROV2', 'PROV3']
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsProviderIdMultipleResponseMocks)
    })
  })

  describe('when depth traversal is used', () => {
    beforeEach(() => {
      parsedInfo = {
        fieldsByTypeName: {
          CitationList: {
            items: {
              fieldsByTypeName: {
                Citation: {
                  associationLevel: {
                    name: 'associationLevel',
                    alias: 'associationLevel',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  relationshipType: {
                    name: 'relationshipType',
                    alias: 'relationshipType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifier: {
                    name: 'identifier',
                    alias: 'identifier',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifierType: {
                    name: 'identifierType',
                    alias: 'identifierType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  name: {
                    name: 'name',
                    alias: 'name',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  title: {
                    name: 'title',
                    alias: 'title',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  abstract: {
                    name: 'abstract',
                    alias: 'abstract',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns citations with depth 2 traversal', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('.times(2)')
           && gremlin.includes('.range(0, 10)')
        })
        .reply(200, associatedCitationsDepth2GraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        {
          limit: 10,
          depth: 2
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsDepth2ResponseMocks)
    })
  })

  describe('when pagination is used', () => {
    beforeEach(() => {
      parsedInfo = {
        fieldsByTypeName: {
          CitationList: {
            items: {
              fieldsByTypeName: {
                Citation: {
                  associationLevel: {
                    name: 'associationLevel',
                    alias: 'associationLevel',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  relationshipType: {
                    name: 'relationshipType',
                    alias: 'relationshipType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifier: {
                    name: 'identifier',
                    alias: 'identifier',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifierType: {
                    name: 'identifierType',
                    alias: 'identifierType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  name: {
                    name: 'name',
                    alias: 'name',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  title: {
                    name: 'title',
                    alias: 'title',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  abstract: {
                    name: 'abstract',
                    alias: 'abstract',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns paginated citations with offset', async () => {
      const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
      getUserGroups.mockImplementationOnce(() => '"guest","registered"')

      nock(/example-graphdb/)
        .post('/', (body) => {
          const { gremlin } = body

          return gremlin
           && gremlin.includes("hasLabel('citation')")
           && gremlin.includes("has('collection', 'id', 'C1200000035-PROV2')")
           && gremlin.includes('.project(\'citationData\', \'associationLevel\', \'relationshipType\')')
           && gremlin.includes('.range(2, 4)')
        })
        .reply(200, associatedCitationsPaginationGraphdbResponseMocks)

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000035-PROV2' },
        {
          limit: 2,
          offset: 2
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsPaginationResponseMocks)
    })
  })

  describe('when user permissions are tested', () => {
    beforeEach(() => {
      parsedInfo = {
        fieldsByTypeName: {
          CitationList: {
            items: {
              fieldsByTypeName: {
                Citation: {
                  associationLevel: {
                    name: 'associationLevel',
                    alias: 'associationLevel',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  relationshipType: {
                    name: 'relationshipType',
                    alias: 'relationshipType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifier: {
                    name: 'identifier',
                    alias: 'identifier',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  identifierType: {
                    name: 'identifierType',
                    alias: 'identifierType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  name: {
                    name: 'name',
                    alias: 'name',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  title: {
                    name: 'title',
                    alias: 'title',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  abstract: {
                    name: 'abstract',
                    alias: 'abstract',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('includes user groups in GraphDB query', async () => {
      nock(/example-graphdb/)
        .post(() => true, (body) => {
          const { gremlin: gremlinQuery } = body
          const correctGremlin = gremlinQuery.includes('within(\'groupid1\',\'groupid2\',\'registered\',\'guest\')')

          return correctGremlin
        })
        .reply(200, associatedCitationsGraphdbResponseMocks)

      nock(/example-urs/)
        .get(/groups_for_user/)
        .reply(200, {
          user_groups: [
            {
              group_id: 'groupid1',
              name: 'test-group-1',
              tag: null,
              shared_user_group: false,
              created_by: 'testuser',
              app_uid: 'testapp',
              client_id: 'testclient'
            },
            {
              group_id: 'groupid2',
              name: 'test-group-2',
              tag: 'testtag',
              shared_user_group: false,
              created_by: 'testuser2',
              app_uid: 'testapp2',
              client_id: 'testclient'
            }
          ]
        })

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000001-PROV1' },
        { limit: 1 },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsResponseMocks)
    })

    test('handles user with no custom groups', async () => {
      nock(/example-graphdb/)
        .post(() => true, (body) => {
          const { gremlin: gremlinQuery } = body
          const correctGremlin = gremlinQuery.includes('within(\'registered\',\'guest\')')

          return correctGremlin
        })
        .reply(200, associatedCitationsGraphdbResponseMocks)

      nock(/example-urs/)
        .get(/groups_for_user/)
        .reply(200, {})

      const response = await graphDbAssociatedCitations(
        { conceptId: 'C1200000001-PROV1' },
        { limit: 1 },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'testUser'
        },
        parsedInfo
      )

      expect(response).toEqual(associatedCitationsResponseMocks)
    })
  })
})
