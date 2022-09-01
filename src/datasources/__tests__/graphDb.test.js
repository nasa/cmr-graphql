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

let parsedInfo

describe('graphDb', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.graphdbHost = 'http://example.com'
    process.env.graphdbPort = '8182'
    process.env.graphdbPath = ''

    process.env.ursRootUrl = 'http://example.com'
    process.env.edlClientId = 'adfadsfagaehrgaergaergareg'
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
          .post(
            () => true,
            /\.or\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+hasLabel\('project','platformInstrument'\)/
          )
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

    describe('When the relatedUrlSubtype parameter is used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(
            () => true,
            /\.or\(.+has\('relatedUrl', 'subtype', within\(\\"USER'S GUIDE\\"\)\),.+hasLabel\('project','platformInstrument'\)/
          )
          .reply(200, relatedCollectionsRelatedUrlSubtypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlSubtype: ["USER'S GUIDE"]
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
          parsedInfo
        )

        expect(response).toEqual(relatedCollectionsRelatedUrlSubtypeResponseMocks)
      })
    })

    describe('When the relatedUrlType and relatedUrlSubtype parameters are used', () => {
      test('returns the parsed graphDb response', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(
            () => true,
            /\.or\(.+and\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+has\('relatedUrl', 'subtype', within\(\\"USER'S GUIDE\\"\)\).+\).+hasLabel\('project','platformInstrument'\)/
          )
          .reply(200, relatedCollectionsRelatedUrlTypeAndSubtypeGraphdbResponseMocks)

        const response = await graphDbDatasource(
          'C1200400842-GHRC',
          {
            limit: 1,
            relatedUrlType: ['VIEW RELATED INFORMATION'],
            relatedUrlSubtype: ["USER'S GUIDE"]
          },
          { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
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
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post(() => true, /\.hasLabel\('project'\)/)
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
          .post(() => true, /\.hasLabel\('platformInstrument'\)/)
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
          .post(() => true, /\.hasLabel\('relatedUrl'\)/)
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
          .post(
            () => true,
            /\.has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\)/
          )
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
          .post(
            () => true,
            /\.or\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+hasLabel\('project'\)/
          )
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
          .post(
            () => true,
            /\.or\(.+has\('relatedUrl', 'type', within\('VIEW RELATED INFORMATION'\)\),.+hasLabel\('project','platformInstrument'\)/
          )
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
          .post(() => true, /\.hasLabel\('project','platformInstrument','relatedUrl'\)/)
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
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(() => true, /\.hasLabel\('project','platformInstrument','relatedUrl'\)/)
        .reply(200, relatedCollectionsNoRelationshipsGraphDbResponseMock)

      const response = await graphDbDatasource(
        'C1200400842-GHRC',
        {
          limit: 1
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        parsedInfo
      )

      expect(response).toEqual(relatedCollectionsNoRelationshipsResponseMock)
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

  describe('Testing permitted groups on related collections', () => {
    test('Testing that permitted groups is in the post request', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/graphdb/, (body) => {
          const { gremlin: gremlinQuery } = body
          const correctGremlin = gremlinQuery.includes('within(\'groupid1\',\'groupid2\',\'registered\',\'guest\')')
          if (correctGremlin) {
            return true
          }
          return false
        })
        .reply(200, relatedCollectionsRelationshipTypeGraphdbResponseMocks)
      nock(/example/)
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

      const response = await graphDbDatasource(
        'C1200400842-GHRC',
        {
          limit: 1
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        parsedInfo,
        'someEdlUsername'
      )
      expect(response).toEqual(relatedCollectionsRelationshipTypeResponseMocks)
    })

    test('Mocking the response for a client not being in any groups, and retrieving no related collections', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/graphdb/, (body) => {
          const { gremlin: gremlinQuery } = body

          const correctGremlin = gremlinQuery.includes('within(\'registered\',\'guest\')')

          if (correctGremlin) {
            return true
          }
          return false
        })
        .reply(200, relatedCollectionsResponseEmptyMocks)

      nock(/example/)
        .get(/groups_for_user/)
        .reply(200, {})

      const response = await graphDbDatasource(
        'C1200400842-GHRC',
        {
          limit: 1
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        parsedInfo,
        'someEdlUsername'
      )
      expect(response).toEqual({ count: 0, items: [] })
    })
  })
})
