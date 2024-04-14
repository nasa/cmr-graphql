import nock from 'nock'

let requestInfo

import {
  createAssociation as associationSourceCreate,
  deleteAssociation as associationSourceDelete
} from '../association'

describe('association#create', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when using associatedConceptId to associate a single concept', () => {
    beforeEach(() => {
      requestInfo = {
        name: 'createAssociation',
        alias: 'createAssociation',
        args: {
          conceptId: 'C1200230699-MMT_1',
          associatedConceptId: 'OO1200454566-MMT_1'
        },
        fieldsByTypeName: {
          AssociationMutationResponse: {
            associatedConceptId: {
              name: 'associatedConceptId',
              alias: 'associatedConceptId',
              args: {},
              fieldsByTypeName: {}
            },
            conceptId: {
              name: 'conceptId',
              alias: 'conceptId',
              args: {},
              fieldsByTypeName: {}
            },
            revisionId: {
              name: 'revisionId',
              alias: 'revisionId',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

    test('returns a single association', async () => {
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

      const response = await associationSourceCreate({
        conceptId: 'C10000000-CMR',
        associatedConceptId: 'OO10000000-CMR'
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual([{
        associatedConceptId: 'OO10000000-CMR',
        conceptId: 'GA10000000-CMR',
        revisionId: 1
      }])
    })
  })

  describe('when using associatedConceptIds to associate multiple concepts', () => {
    beforeEach(() => {
      requestInfo = {
        name: 'createAssociation',
        alias: 'createAssociation',
        args: {
          conceptId: 'C1200230699-MMT_1',
          associatedConceptIds: [
            'OO1200454566-MMT_1'
          ]
        },
        fieldsByTypeName: {
          AssociationMutationResponse: {
            associatedConceptId: {
              name: 'associatedConceptId',
              alias: 'associatedConceptId',
              args: {},
              fieldsByTypeName: {}
            },
            conceptId: {
              name: 'conceptId',
              alias: 'conceptId',
              args: {},
              fieldsByTypeName: {}
            },
            revisionId: {
              name: 'revisionId',
              alias: 'revisionId',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

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

      const response = await associationSourceCreate({
        conceptId: 'C10000000-CMR',
        associatedConceptIds: ['OO10000000-CMR', 'OO10000001-CMR']
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual([{
        conceptId: 'GA10000000-CMR',
        revisionId: 1,
        associatedConceptId: 'OO10000000-CMR'
      }, {
        conceptId: 'GA10000001-CMR',
        revisionId: 1,
        associatedConceptId: 'OO10000001-CMR'
      }])
    })
  })

  describe('when using associatedConcepts to associate multiple concepts with data', () => {
    beforeEach(() => {
      requestInfo = {
        name: 'createAssociation',
        alias: 'createAssociation',
        args: {
          conceptId: 'C1200230699-MMT_1',
          associatedConceptData: [
            {
              concept_id: 'OO1200454566-MMT_1',
              data: {
                test: true
              }
            }
          ]
        },
        fieldsByTypeName: {
          AssociationMutationResponse: {
            associatedConceptId: {
              name: 'associatedConceptId',
              alias: 'associatedConceptId',
              args: {},
              fieldsByTypeName: {}
            },
            conceptId: {
              name: 'conceptId',
              alias: 'conceptId',
              args: {},
              fieldsByTypeName: {}
            },
            revisionId: {
              name: 'revisionId',
              alias: 'revisionId',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

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

      const response = await associationSourceCreate({
        conceptId: 'C10000000-CMR',
        associatedConceptData: [{
          concept_id: 'OO10000000-CMR',
          data: { test: true }
        }, {
          concept_id: 'OO10000001-CMR'
        }]
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual([{
        conceptId: 'GA10000000-CMR',
        revisionId: 1,
        associatedConceptId: 'OO10000000-CMR'
      }, {
        conceptId: 'GA10000001-CMR',
        revisionId: 1,
        associatedConceptId: 'OO10000001-CMR'
      }])
    })
  })

  test('catches errors received from create CMR', async () => {
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
      .reply(500, {
        errors: ['HTTP Error']
      })

    await expect(
      associationSourceCreate({
        conceptId: 'C10000000-CMR',
        associatedConceptId: 'OO10000000-CMR'
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})

describe('association#delete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when using associatedConceptId to associate a single concept', () => {
    beforeEach(() => {
      requestInfo = {
        name: 'deleteAssociation',
        alias: 'deleteAssociation',
        args: {
          conceptId: 'C1200230699-MMT_1',
          associatedConceptId: 'OO1200454566-MMT_1'
        },
        fieldsByTypeName: {
          AssociationMutationResponse: {
            revisionId: {
              name: 'revisionId',
              alias: 'revisionId',
              args: {},
              fieldsByTypeName: {}
            },
            conceptId: {
              name: 'conceptId',
              alias: 'conceptId',
              args: {},
              fieldsByTypeName: {}
            },
            associatedConceptId: {
              name: 'associatedConceptId',
              alias: 'associatedConceptId',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

    test('returns a single association', async () => {
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

      const response = await associationSourceDelete({
        conceptId: 'C10000000-CMR',
        associatedConceptId: 'OO10000000-CMR'
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual([{
        associatedConceptId: 'OO10000000-CMR',
        conceptId: 'GA10000000-CMR',
        revisionId: 1
      }])
    })
  })

  describe('when using associatedConceptIds to associate multiple concepts', () => {
    beforeEach(() => {
      requestInfo = {
        name: 'createAssociation',
        alias: 'createAssociation',
        args: {
          conceptId: 'C1200230699-MMT_1',
          associatedConceptIds: [
            'OO1200454566-MMT_1'
          ]
        },
        fieldsByTypeName: {
          AssociationMutationResponse: {
            associatedConceptId: {
              name: 'associatedConceptId',
              alias: 'associatedConceptId',
              args: {},
              fieldsByTypeName: {}
            },
            conceptId: {
              name: 'conceptId',
              alias: 'conceptId',
              args: {},
              fieldsByTypeName: {}
            },
            revisionId: {
              name: 'revisionId',
              alias: 'revisionId',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

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

      const response = await associationSourceDelete({
        conceptId: 'C10000000-CMR',
        associatedConceptIds: ['OO10000000-CMR', 'OO10000001-CMR']
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual([{
        conceptId: 'GA10000000-CMR',
        revisionId: 1,
        associatedConceptId: 'OO10000000-CMR'
      }, {
        conceptId: 'GA10000001-CMR',
        revisionId: 1,
        associatedConceptId: 'OO10000001-CMR'
      }])
    })
  })

  test('catches errors received from create CMR', async () => {
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
      .reply(500, {
        errors: ['HTTP Error']
      })

    await expect(
      associationSourceDelete({
        conceptId: 'C10000000-CMR',
        associatedConceptId: 'OO10000000-CMR'
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})
