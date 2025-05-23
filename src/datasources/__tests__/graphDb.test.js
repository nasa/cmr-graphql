import nock from 'nock'

import graphDbDatasource from '../graphDb'

import relatedCollectionsCitationGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbCitation.graphdbResponse.mocks'
import relatedCollectionsCitationResponseMocks from './__mocks__/relatedCollections.graphDbCitation.response.mocks'
import relatedCollectionsScienceKeywordGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbScienceKeyword.graphdbResponse.mocks'
import relatedCollectionsScienceKeywordResponseMocks from './__mocks__/relatedCollections.graphDbScienceKeyword.response.mocks'
import relatedCollectionsCitationScienceKeywordGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbCitationScienceKeyword.graphdbResponse.mocks'
import relatedCollectionsCitationScienceKeywordResponseMocks from './__mocks__/relatedCollections.graphDbCitationScienceKeyword.response.mocks'
import relatedCollectionsNoRelationshipsGraphDbResponseMock from './__mocks__/relatedCollections.noRelationships.graphdbResponse.mocks'
import relatedCollectionsNoRelationshipsResponseMock from './__mocks__/relatedCollections.noRelationships.response.mocks'
import relatedCollectionsRelationshipTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relationshipType.graphdbResponse.mocks'
import relatedCollectionsRelationshipTypeResponseMocks from './__mocks__/relatedCollections.relationshipType.response.mocks'
import relatedCollectionsResponseEmptyMocks from './__mocks__/relatedCollections.response.empty.mocks'
import * as getUserPermittedGroups from '../../utils/getUserPermittedGroups'

let parsedInfo

describe('graphDb', () => {
  const OLD_ENV = process.env
  // Default parsedInfo for tests that don't define their own
  const defaultParsedInfo = {
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

  describe('When a subset of relationship types are requested', () => {
    describe('When only GraphDbCitation is requested', () => {
      test('returns a result with only citation types', async () => {
        parsedInfo = {
          name: 'relatedCollections',
          alias: 'relatedCollections',
          args: {
            params: {
              limit: 1
            }
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
                    shortName: {
                      name: 'shortName',
                      alias: 'shortName',
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

        nock(/example-graphdb/)
          .post(() => true, /\.hasLabel\('citation'\)/)
          .reply(200, relatedCollectionsCitationGraphdbResponseMocks)

        const response = await graphDbDatasource(
          { conceptId: 'C1200000058-PROV2' },
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

        expect(response).toEqual(relatedCollectionsCitationResponseMocks)
      })
    })

    describe('When only GraphDbScienceKeyword is requested', () => {
      test('returns a result with only scienceKeyword types', async () => {
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
                        },
                        GraphDbScienceKeyword: {
                          value: {
                            name: 'value',
                            alias: 'value',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          variableLevel1: {
                            name: 'variableLevel1',
                            alias: 'variableLevel1',
                            args: {},
                            fieldsByTypeName: {}
                          },
                          level: {
                            name: 'level',
                            alias: 'level',
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

        nock(/example-graphdb/)
          .post(() => true, /\.hasLabel\('scienceKeyword'\)/)
          .reply(200, relatedCollectionsScienceKeywordGraphdbResponseMocks)

        const response = await graphDbDatasource(
          { conceptId: 'C1200000058-PROV2' },
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

        expect(response).toEqual(relatedCollectionsScienceKeywordResponseMocks)
      })
    })

    describe('When both GraphDbCitation and GraphDbScienceKeyword are requested', () => {
      test('returns a result with both citation and scienceKeyword types', async () => {
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
                    shortName: {
                      name: 'shortName',
                      alias: 'shortName',
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
                        },
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

        nock(/example-graphdb/)
          .post(() => true, /\.hasLabel\('citation','scienceKeyword'\)/)
          .reply(200, relatedCollectionsCitationScienceKeywordGraphdbResponseMocks)

        const response = await graphDbDatasource(
          { conceptId: 'C1200000058-PROV2' },
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

        expect(response).toEqual(relatedCollectionsCitationScienceKeywordResponseMocks)
      })
    })

    describe('When no types are requested, but only relationshipType is requested', () => {
      test('returns a result with all relationship types (citation and scienceKeyword)', async () => {
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
                    shortName: {
                      name: 'shortName',
                      alias: 'shortName',
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

        nock(/example-graphdb/)
          .post(() => true, /\.hasLabel\(\\"citation\\", \\"scienceKeyword\\"\)/)
          .reply(200, relatedCollectionsRelationshipTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          { conceptId: 'C1200000058-PROV2' },
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

    describe('When neither specific types nor relationshipType are requested', () => {
      test('defaults to all relationship types', async () => {
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
                    relationships: {
                      name: 'relationships',
                      alias: 'relationships',
                      args: {},
                      fieldsByTypeName: {
                        Relationship: {}
                      }
                    }
                  }
                }
              }
            }
          }
        }

        nock(/example-graphdb/)
          .post(() => true, /\.hasLabel\(\\"citation\\", \\"scienceKeyword\\"\)/)
          .reply(200, relatedCollectionsRelationshipTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          { conceptId: 'C1200000058-PROV2' },
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
      test('returns a result with all relationship types', async () => {
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

        nock(/example-graphdb/)
          .post(() => true, /\.hasLabel\(\\"citation\\", \\"scienceKeyword\\"\)/)
          .reply(200, relatedCollectionsNoRelationshipsGraphDbResponseMock)

        const response = await graphDbDatasource(
          { conceptId: 'C1200000058-PROV2' },
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

    describe('Testing permitted groups on related collections', () => {
      test('Testing that permitted groups is in the post request', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => "'groupid1','groupid2','registered','guest'")

        const scope = nock(/example-graphdb/)
          .post(() => true, (body) => {
            const { gremlin: gremlinQuery } = body

            const correctGremlin = gremlinQuery.includes('within(\'groupid1\',\'groupid2\',\'registered\',\'guest\')')
            if (correctGremlin) {
              return true
            }

            return false
          })
          .reply(200, relatedCollectionsRelationshipTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          { conceptId: 'C1200000058-PROV2' },
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
          defaultParsedInfo
        )
        expect(response).toEqual(relatedCollectionsRelationshipTypeResponseMocks)
        expect(scope.isDone()).toBe(true)
      })

      test('Mocking the response for a client not being in any groups, and retrieving no related collections', async () => {
        const getUserGroups = vi.spyOn(getUserPermittedGroups, 'getUserPermittedGroups')
        getUserGroups.mockImplementationOnce(() => "'registered','guest'")

        const scope = nock(/example-graphdb/)
          .post(() => true, (body) => {
            const { gremlin: gremlinQuery } = body

            const correctGremlin = gremlinQuery.includes('within(\'registered\',\'guest\')')

            if (correctGremlin) {
              return true
            }

            return false
          })
          .reply(200, relatedCollectionsResponseEmptyMocks)

        const response = await graphDbDatasource(
          { conceptId: 'C1200000058-PROV2' },
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
          defaultParsedInfo
        )
        expect(response).toEqual({
          count: 0,
          items: []
        })

        expect(scope.isDone()).toBe(true)
      })
    })
  })
})
