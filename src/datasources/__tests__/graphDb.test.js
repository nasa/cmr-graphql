import nock from 'nock'

import graphDbDatasource from '../graphDb'

import relatedCollectionsRelatedUrlTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlType.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlTypeResponseMocks from './__mocks__/relatedCollections.relatedUrlType.response.mocks'
import relatedCollectionsRelatedUrlSubTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlSubType.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlSubTypeResponseMocks from './__mocks__/relatedCollections.relatedUrlSubType.response.mocks'
import relatedCollectionsRelatedUrlTypeAndSubTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlTypeAndSubType.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlTypeAndSubTypeResponseMocks from './__mocks__/relatedCollections.relatedUrlTypeAndSubType.response.mocks'
import relatedCollectionsGraphDbProjectGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbProject.graphdbResponse.mocks'
import relatedCollectionsGraphDbProjectResponseMocks from './__mocks__/relatedCollections.graphDbProject.response.mocks'
import relatedCollectionsGraphDbPlatformInstrumentGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbPlatformInstrument.graphdbResponse.mocks'
import relatedCollectionsGraphDbPlatformInstrumentResponseMocks from './__mocks__/relatedCollections.graphDbPlatformInstrument.response.mocks'
import relatedCollectionsGraphDbRelatedUrlGraphdbResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrl.graphdbResponse.mocks'
import relatedCollectionsGraphDbRelatedUrlResponseMocks from './__mocks__/relatedCollections.graphDbRelatedUrl.response.mocks'
import relatedCollectionsRelationshipTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relationshipType.graphdbResponse.mocks'
import relatedCollectionsRelationshipTypeResponseMocks from './__mocks__/relatedCollections.relationshipType.response.mocks'

let parsedInfo

describe('graphDb', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
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
                        subType: {
                          name: 'subType',
                          alias: 'subType',
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
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/,
            /\.or\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+hasLabel\('project','platformInstrument'\)/)
          .reply(200, relatedCollectionsRelatedUrlTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlTypeResponseMocks)
      })
    })

    describe('When the relatedUrlSubType parameter is used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/,
            /\.or\(.+has\('relatedUrl', 'subType', within\(\\"USER'S GUIDE\\"\)\),.+hasLabel\('project','platformInstrument'\)/)
          .reply(200, relatedCollectionsRelatedUrlSubTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlSubType: ["USER'S GUIDE"]
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlSubTypeResponseMocks)
      })
    })

    describe('When the relatedUrlType and relatedUrlSubType parameters are used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/,
            /\.or\(.+and\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+has\('relatedUrl', 'subType', within\(\\"USER'S GUIDE\\"\)\).+\).+hasLabel\('project','platformInstrument'\)/)
          .reply(200, relatedCollectionsRelatedUrlTypeAndSubTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION'],
            relatedUrlSubType: ["USER'S GUIDE"]
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlTypeAndSubTypeResponseMocks)
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
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/, /\.hasLabel\('project'\)/)
          .reply(200, relatedCollectionsGraphDbProjectGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
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
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/, /\.hasLabel\('platformInstrument'\)/)
          .reply(200, relatedCollectionsGraphDbPlatformInstrumentGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
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
                          subType: {
                            name: 'subType',
                            alias: 'subType',
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
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/, /\.hasLabel\('relatedUrl'\)/)
          .reply(200, relatedCollectionsGraphDbRelatedUrlGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
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
                          subType: {
                            name: 'subType',
                            alias: 'subType',
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
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/,
            /\.has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\)/)
          .reply(200, relatedCollectionsGraphDbRelatedUrlGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbRelatedUrlResponseMocks)
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

      test('returns a result with only all relationship types', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/, /\.hasLabel\('project','platformInstrument','relatedUrl'\)/)
          .reply(200, relatedCollectionsRelationshipTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelationshipTypeResponseMocks)
      })
    })
  })

  test('catches errors received from queryCmrTools', async () => {
    nock(/example/)
      .post(/tools/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      graphDbDatasource(
        'C1200400842-GHRC',
        {
          limit: 1
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        parsedInfo
      )
    ).rejects.toThrow(Error)
  })
})
