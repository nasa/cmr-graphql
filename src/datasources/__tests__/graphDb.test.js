import nock from 'nock'

import graphDbDatasource from '../graphDb'

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
import relatedCollectionsRelatedUrlsubtypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlsubtype.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlsubtypeResponseMocks from './__mocks__/relatedCollections.relatedUrlsubtype.response.mocks'
import relatedCollectionsRelatedUrlTypeAndsubtypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlTypeAndsubtype.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlTypeAndsubtypeResponseMocks from './__mocks__/relatedCollections.relatedUrlTypeAndsubtype.response.mocks'
import relatedCollectionsRelatedUrlTypeGraphdbResponseMocks from './__mocks__/relatedCollections.relatedUrlType.graphdbResponse.mocks'
import relatedCollectionsRelatedUrlTypeResponseMocks from './__mocks__/relatedCollections.relatedUrlType.response.mocks'
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

    describe('When the relatedUrlsubtype parameter is used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/,
            /\.or\(.+has\('relatedUrl', 'subtype', within\(\\"USER'S GUIDE\\"\)\),.+hasLabel\('project','platformInstrument'\)/)
          .reply(200, relatedCollectionsRelatedUrlsubtypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlsubtype: ["USER'S GUIDE"]
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlsubtypeResponseMocks)
      })
    })

    describe('When the relatedUrlType and relatedUrlsubtype parameters are used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/,
            /\.or\(.+and\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+has\('relatedUrl', 'subtype', within\(\\"USER'S GUIDE\\"\)\).+\).+hasLabel\('project','platformInstrument'\)/)
          .reply(200, relatedCollectionsRelatedUrlTypeAndsubtypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION'],
            relatedUrlsubtype: ["USER'S GUIDE"]
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlTypeAndsubtypeResponseMocks)
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
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/,
            /\.or\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+hasLabel\('project'\)/)
          .reply(200, relatedCollectionsGraphDbRelatedUrlProjectGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
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

      test('returns a result with only all types', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(/graphdb/,
            /\.or\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+hasLabel\('project','platformInstrument'\)/)
          .reply(200, relatedCollectionsGraphDbRelatedUrlRelationshipTypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION']
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsGraphDbRelatedUrlRelationshipTypeResponseMocks)
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
