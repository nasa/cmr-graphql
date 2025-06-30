import nock from 'nock'

import graphDbRelatedCollectionsDatasource from '../graphDbRelatedCollections'

import relatedCollectionsGraphDbPlatformInstrumentGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbPlatformInstrument.graphdbResponse.mocks'
import relatedCollectionsGraphDbPlatformInstrumentResponseMocks from './__mocks__/relatedCollections.graphDbPlatformInstrument.response.mocks'
import relatedCollectionsGraphDbProjectGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbProject.graphdbResponse.mocks'
import relatedCollectionsGraphDbProjectResponseMocks from './__mocks__/relatedCollections.graphDbProject.response.mocks'
import relatedCollectionsGraphDbRelatedUrlGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrl.graphdbResponse.mocks'
import relatedCollectionsGraphDbRelatedUrlProjectGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrlProject.graphdbResponse.mocks'
import relatedCollectionsGraphDbRelatedUrlProjectResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrlProject.response.mocks'
import relatedCollectionsGraphDbRelatedUrlRelationshipTypeGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrlRelationshipType.graphdbResponse.mocks'
import relatedCollectionsGraphDbRelatedUrlRelationshipTypeResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrlRelationshipType.response.mocks'
import relatedCollectionsGraphDbRelatedUrlResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrl.response.mocks'
import relatedCollectionsNoRelationshipsGraphDbResponseMock from './__mocks__/relatedCollections.noRelationships.graphdbResponse.mocks'
import relatedCollectionsNoRelationshipsResponseMock from './__mocks__/relatedCollections.noRelationships.response.mocks'
import relatedCollectionsRelatedUrlSubtypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlSubtype.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlSubtypeResponseMocks from './__mocks__/relatedCollections.relatedUrlSubtype.response.mocks'
import relatedCollectionsRelatedUrlTypeAndSubtypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlTypeAndSubtype.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlTypeAndSubtypeResponseMocks from './__mocks__/relatedCollections.relatedUrlTypeAndSubtype.response.mocks'
import relatedCollectionsRelatedUrlTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlType.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlTypeResponseMocks from './__mocks__/relatedCollections.relatedUrlType.response.mocks'
import relatedCollectionsRelationshipTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relationshipType.graphdbResponse.mocks'
import relatedCollectionsRelationshipTypeResponseMocks from './__mocks__/relatedCollections.relationshipType.response.mocks'
import relatedCollectionsResponseEmptyMocks from './__mocks__/relatedCollections.response.empty.mocks'
import relatedCollectionsGraphDbCitationGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbCitation.graphdbResponse.mocks'
import relatedCollectionsGraphDbCitationResponseMocks from './__mocks__/relatedCollections.graphDbCitation.response.mocks'
import relatedCollectionsGraphDbScienceKeywordGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbScienceKeyword.graphdbResponse.mocks'
import relatedCollectionsGraphDbScienceKeywordResponseMocks from './__mocks__/relatedCollections.graphDbScienceKeyword.response.mocks'
import relatedCollectionsGraphDbRelatedUrlCitationGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrlCitation.graphdbResponse.mocks'
import relatedCollectionsGraphDbRelatedUrlCitationResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrlCitation.response.mocks'
import * as getUserPermittedGroups from '../../utils/getUserPermittedGroups'

let parsedInfo

describe('graphDb', () => {
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

  describe('relatedCollections with parameters', () => {
    beforeEach(() => {
      parsedInfo = {
        name: 'relatedCollections',
        alias: 'relatedCollections',
        args: {
          limit: 1,
          relatedUrlType: [
            'VIEW RELATED INFORMATION'
          ]
        },
        fieldsByTypeName: {
          RelatedCollectionsList: {
            count: {
              name: 'count',
              alias: 'count',
              args: {},
              fieldsByTypeName: {}
            },
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                RelatedCollection: {
                  relationships: {
                    name: 'relationships',
                    alias: 'relationships',
                    args: {},
                    fieldsByTypeName: {
                      Relationship: {
                        relationshipType: {
                          name: 'relationshipType',
                          alias: 'relationshipType',
                          args: {},
                          fieldsByTypeName: {}
                        }
                      },
                      GraphDbProject: {
                        name: {
                          name: 'name',
                          alias: 'name',
                          args: {},
                          fieldsByTypeName: {}
                        }
                      },
                      GraphDbPlatformInstrument: {
                        platform: {
                          name: 'platform',
                          alias: 'platform',
                          args: {},
                          fieldsByTypeName: {}
                        },
                        instrument: {
                          name: 'instrument',
                          alias: 'instrument',
                          args: {},
                          fieldsByTypeName: {}
                        }
                      },
                      GraphDbRelatedUrl: {
                        url: {
                          name: 'url',
                          alias: 'url',
                          args: {},
                          fieldsByTypeName: {}
                        },
                        description: {
                          name: 'description',
                          alias: 'description',
                          args: {},
                          fieldsByTypeName: {}
                        },
                        type: {
                          name: 'type',
                          alias: 'type',
                          args: {},
                          fieldsByTypeName: {}
                        },
                        subtype: {
                          name: 'subtype',
                          alias: 'subtype',
                          args: {},
                          fieldsByTypeName: {}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    describe('When the relatedUrlType parameter is used', () => {
      test('returns the parsed graphDb response', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasOrClause = gremlinQuery.includes('.or(')
            const hasRelatedUrlType = gremlinQuery.includes("has('relatedUrl', 'type', within('VIEW RELATED INFORMATION'))")
            const hasAllTypes = gremlinQuery.includes("hasLabel('project','platformInstrument','citation','scienceKeyword')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasOrClause && hasRelatedUrlType && hasAllTypes && hasOtherV
          })
          .reply(200, relatedCollectionsRelatedUrlTypeGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlTypeResponseMocks)
      })
    })

    describe('When the relatedUrlSubtype parameter is used', () => {
      test('returns the parsed graphDb response', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasOrClause = gremlinQuery.includes('.or(')
            const hasRelatedUrlSubtype = gremlinQuery.includes('has(\'relatedUrl\', \'subtype\', within("USER\'S GUIDE"))')
            const hasOtherLabels = gremlinQuery.includes("hasLabel('project','platformInstrument','citation','scienceKeyword')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasOrClause && hasRelatedUrlSubtype && hasOtherLabels && hasOtherV
          })
          .reply(200, relatedCollectionsRelatedUrlSubtypeGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1,
            relatedUrlSubtype: ["USER'S GUIDE"]
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlSubtypeResponseMocks)
      })
    })

    describe('When the relatedUrlType and relatedUrlSubtype parameters are used', () => {
      test('returns the parsed graphDb response', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasOrClause = gremlinQuery.includes('.or(')
            const hasAndClause = gremlinQuery.includes('and(')
            const hasRelatedUrlType = gremlinQuery.includes("has('relatedUrl', 'type', within('VIEW RELATED INFORMATION'))")
            const hasRelatedUrlSubtype = gremlinQuery.includes('has(\'relatedUrl\', \'subtype\', within("USER\'S GUIDE"))')
            const hasOtherLabels = gremlinQuery.includes("hasLabel('project','platformInstrument','citation','scienceKeyword')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return (
              hasOrClause && hasAndClause && hasRelatedUrlType
              && hasRelatedUrlSubtype && hasOtherLabels && hasOtherV
            )
          })
          .reply(200, relatedCollectionsRelatedUrlTypeAndSubtypeGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION'],
            relatedUrlSubtype: ["USER'S GUIDE"]
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlTypeAndSubtypeResponseMocks)
      })
    })
  })

  describe('When a subset of relationship types are requested', () => {
    describe('When only GraphDbProject is requested', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {},
                        GraphDbProject: {
                          name: {
                            name: 'name',
                            alias: 'name',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with only project types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasProjectLabel = gremlinQuery.includes(".hasLabel('project')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasProjectLabel && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbProjectGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbProjectResponseMocks)
      })
    })

    describe('When only GraphDbPlatformInstrument is requested', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {},
                        GraphDbPlatformInstrument: {
                          platform: {
                            name: 'platform',
                            alias: 'platform',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          instrument: {
                            name: 'instrument',
                            alias: 'instrument',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with only platformInstrument types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasPlatformInstrumentLabel = gremlinQuery.includes(".hasLabel('platformInstrument')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasPlatformInstrumentLabel && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbPlatformInstrumentGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbPlatformInstrumentResponseMocks)
      })
    })

    describe('When only GraphDbRelatedUrl is requested', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {},
                        GraphDbRelatedUrl: {
                          url: {
                            name: 'url',
                            alias: 'url',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          description: {
                            name: 'description',
                            alias: 'description',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          type: {
                            name: 'type',
                            alias: 'type',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          subtype: {
                            name: 'subtype',
                            alias: 'subtype',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with only relatedUrl types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasRelatedUrlLabel = gremlinQuery.includes(".hasLabel('relatedUrl')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasRelatedUrlLabel && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbRelatedUrlGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbRelatedUrlResponseMocks)
      })
    })

    describe('When only GraphDbRelatedUrl is requested with parameters', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1,
            relatedUrlType: [
              'VIEW RELATED INFORMATION'
            ]
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {},
                        GraphDbRelatedUrl: {
                          url: {
                            name: 'url',
                            alias: 'url',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          description: {
                            name: 'description',
                            alias: 'description',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          type: {
                            name: 'type',
                            alias: 'type',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          subtype: {
                            name: 'subtype',
                            alias: 'subtype',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with only relatedUrl types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasRelatedUrlType = gremlinQuery.includes("has('relatedUrl', 'type', within('VIEW RELATED INFORMATION'))")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasRelatedUrlType && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbRelatedUrlGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbRelatedUrlResponseMocks)
      })
    })

    describe('When GraphDbRelatedUrl is requested with parameters and other types', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1,
            relatedUrlType: [
              'VIEW RELATED INFORMATION'
            ]
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {},
                        GraphDbProject: {
                          name: {
                            name: 'name',
                            alias: 'name',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        },
                        GraphDbRelatedUrl: {
                          url: {
                            name: 'url',
                            alias: 'url',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          description: {
                            name: 'description',
                            alias: 'description',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          type: {
                            name: 'type',
                            alias: 'type',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          subtype: {
                            name: 'subtype',
                            alias: 'subtype',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with only relatedUrl and project types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasOrClause = gremlinQuery.includes('.or(')
            const hasRelatedUrlType = gremlinQuery.includes("has('relatedUrl', 'type', within('VIEW RELATED INFORMATION'))")
            const hasProjectLabel = gremlinQuery.includes("hasLabel('project')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasOrClause && hasRelatedUrlType && hasProjectLabel && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbRelatedUrlProjectGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbRelatedUrlProjectResponseMocks)
      })
    })

    describe('When only GraphDbRelatedUrl is requested with parameters and relationshipType', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1,
            relatedUrlType: [
              'VIEW RELATED INFORMATION'
            ]
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {
                          relationshipType: {
                            name: 'relationshipType',
                            alias: 'relationshipType',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        },
                        GraphDbRelatedUrl: {
                          url: {
                            name: 'url',
                            alias: 'url',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          description: {
                            name: 'description',
                            alias: 'description',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          type: {
                            name: 'type',
                            alias: 'type',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          subtype: {
                            name: 'subtype',
                            alias: 'subtype',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with all types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasOrClause = gremlinQuery.includes('.or(')
            const hasRelatedUrlType = gremlinQuery.includes("has('relatedUrl', 'type', within('VIEW RELATED INFORMATION'))")
            const hasAllTypes = gremlinQuery.includes("hasLabel('project','platformInstrument','citation','scienceKeyword')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasOrClause && hasRelatedUrlType && hasAllTypes && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbRelatedUrlRelationshipTypeGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbRelatedUrlRelationshipTypeResponseMocks)
      })
    })

    describe('When only GraphDbCitation is requested', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {},
                        GraphDbCitation: {
                          title: {
                            name: 'title',
                            alias: 'title',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          id: {
                            name: 'id',
                            alias: 'id',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with only citation types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasCitationLabel = gremlinQuery.includes(".hasLabel('citation')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasCitationLabel && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbCitationGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbCitationResponseMocks)
      })
    })

    describe('When only GraphDbScienceKeyword is requested', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {},
                        GraphDbScienceKeyword: {
                          value: {
                            name: 'value',
                            alias: 'value',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          level: {
                            name: 'level',
                            alias: 'level',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          variableLevel1: {
                            name: 'variableLevel1',
                            alias: 'variableLevel1',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with only scienceKeyword types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasScienceKeywordLabel = gremlinQuery.includes(".hasLabel('scienceKeyword')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasScienceKeywordLabel && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbScienceKeywordGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbScienceKeywordResponseMocks)
      })
    })

    describe('When multiple relationship types including new ones are requested', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {},
                        GraphDbRelatedUrl: {
                          url: {
                            name: 'url',
                            alias: 'url',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          description: {
                            name: 'description',
                            alias: 'description',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          type: {
                            name: 'type',
                            alias: 'type',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          subtype: {
                            name: 'subtype',
                            alias: 'subtype',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        },
                        GraphDbCitation: {
                          title: {
                            name: 'title',
                            alias: 'title',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          id: {
                            name: 'id',
                            alias: 'id',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with relatedUrl and citation types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasProjectCitationLabels = gremlinQuery.includes(".hasLabel('relatedUrl','citation')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasProjectCitationLabels && hasOtherV
          })
          .reply(200, relatedCollectionsGraphDbRelatedUrlCitationGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbRelatedUrlCitationResponseMocks)
      })
    })

    describe('When no types are requested, but only relationshipType is requested', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    doi: {
                      name: 'doi',
                      alias: 'doi',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {
                          relationshipType: {
                            name: 'relationshipType',
                            alias: 'relationshipType',
                            args: {},
                            fieldsByTypeName: {}
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      })

      test('returns a result with all relationship types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasAllRelationshipTypes = gremlinQuery.includes(".hasLabel('project','platformInstrument','relatedUrl','citation','scienceKeyword')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasAllRelationshipTypes && hasOtherV
          })
          .reply(200, relatedCollectionsRelationshipTypeGraphdbResponseMocks)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelationshipTypeResponseMocks)
      })
    })

    describe('When relationships aren\'t requested', () => {
      beforeEach(() => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            limit: 1
          },
          fieldsByTypeName: {
            RelatedCollectionsList: {
              count: {
                name: 'count',
                alias: 'count',
                args: {},
                fieldsByTypeName: {}
              },
              items: {
                name: 'items',
                alias: 'items',
                args: {},
                fieldsByTypeName: {
                  RelatedCollection: {
                    id: {
                      name: 'id',
                      alias: 'id',
                      args: {},
                      fieldsByTypeName: {}
                    },
                    title: {
                      name: 'title',
                      alias: 'title',
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

      test('returns a result with all relationship types', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => (''))

        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasAllRelationshipTypes = gremlinQuery.includes(".hasLabel('project','platformInstrument','relatedUrl','citation','scienceKeyword')")
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasAllRelationshipTypes && hasOtherV
          })
          .reply(200, relatedCollectionsNoRelationshipsGraphDbResponseMock)

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'edlUsername'
          },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsNoRelationshipsResponseMock)
      })
    })
  })

  describe('When the related collections are behind permitted groups', () => {
    test('Testing that permitted groups are in the gremlin request', async () => {
      nock(/example-graphdb/)
        .post('/', (body) => {
          const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
          const gremlinQuery = parsedBody?.gremlin || ''

          const hasCorrectPermittedGroups = gremlinQuery.includes('within(\'groupid1\',\'groupid2\',\'registered\',\'guest\')')
          const hasOtherV = gremlinQuery.includes('.otherV()')

          return hasCorrectPermittedGroups && hasOtherV
        })
        .reply(200, relatedCollectionsRelationshipTypeGraphdbResponseMocks)

      nock(/example-urs/)
        .get(/groups_for_user/)
        .reply(200, {
          user_groups: [
            {
              group_id: 'groupid1',
              name: 'afageg',
              tag: null,
              shared_user_group: false,
              created_by: 'bocntzm3asdfh54_o5haghjehx',
              app_uid: 'bocntzm3h54ssdf_o5haghjehx',
              client_id: 'asdfadfadfasdfwr'
            },
            {
              group_id: 'groupid2',
              name: 'qwerqwerqwerq-trert',
              tag: 'qwerqwerqwfqrgqeg',
              shared_user_group: false,
              created_by: 'asdfwerqetqrhwr',
              app_uid: 'asdfasdfasdfwerwe',
              client_id: 'asdfadfadfasdfwr'
            }
          ]
        })

      const response = await graphDbRelatedCollectionsDatasource(
        { conceptId: 'C100000-EDSC' },
        {
          limit: 1
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'someEdlUsername'
        },
        parsedInfo
      )
      expect(response).toEqual(relatedCollectionsRelationshipTypeResponseMocks)
    })

    describe('when the user is in no groups', () => {
      test('the response contains no related collections', async () => {
        nock(/example-graphdb/)
          .post('/', (body) => {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body
            const gremlinQuery = parsedBody?.gremlin || ''

            const hasCorrectPermittedGroups = gremlinQuery.includes('within(\'registered\',\'guest\')')
            const hasOtherV = gremlinQuery.includes('.otherV()')

            return hasCorrectPermittedGroups && hasOtherV
          })
          .reply(200, relatedCollectionsResponseEmptyMocks)

        nock(/example-urs/)
          .get(/groups_for_user/)
          .reply(200, {})

        const response = await graphDbRelatedCollectionsDatasource(
          { conceptId: 'C100000-EDSC' },
          {
            limit: 1
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            },
            edlUsername: 'someEdlUsername'
          },
          parsedInfo
        )
        expect(response).toEqual({
          count: 0,
          items: []
        })
      })
    })
  })
})
