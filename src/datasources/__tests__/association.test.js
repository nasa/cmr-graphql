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

    // Default requestInfo
    requestInfo = {
      name: 'createAssociation',
      alias: 'createAssociation',
      args: {
        conceptType: 'Tool',
        conceptId: 'T12000000',
        collectionConceptIds: [
          {
            conceptId: 'C12000000'
          }
        ]
      },
      fieldsByTypeName: {
        AssociationMutationResponse: {
          toolAssociation: {
            name: 'toolAssociation',
            alias: 'toolAssociation',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('return the parsed association results', async () => {
    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .post(/search\/tools\/T12000000\/associations/, JSON.stringify([{ concept_id: 'C12000000' }]))
      .reply(201, [{
        tool_association: {
          concept_id: 'TLA12000000-CMR',
          revision_id: 1
        }
      }])

    const response = await associationSourceCreate({
      conceptType: 'Tool',
      conceptId: 'T12000000',
      collectionConceptIds: [
        {
          conceptId: 'C12000000'
        }
      ]

    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      toolAssociation: {
        concept_id: 'TLA12000000-CMR',
        revision_id: 1
      }
    })
  })

  test('catches errors received from create CMR', async () => {
    nock(/example-cmr/)
      .post(/search\/tools\/T12000000\/associations/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      associationSourceCreate({
        conceptType: 'Tool',
        conceptId: 'T12000000',
        collectionConceptIds: [
          {
            conceptId: 'C12000000'
          }
        ]

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

    // Default requestInfo
    requestInfo = {
      name: 'deleteAssociation',
      alias: 'deleteAssociation',
      args: {
        conceptType: 'Tool',
        conceptId: 'T12000000',
        collectionConceptIds: [
          {
            conceptId: 'C12000000'
          }
        ]
      },
      fieldsByTypeName: {
        AssociationMutationResponse: {
          toolAssociation: {
            name: 'toolAssociation',
            alias: 'toolAssociation',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('returns the parsed association results', async () => {
    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .delete(/search\/tools\/T12000000\/associations/)
      .reply(201, [{
        tool_association: {
          concept_id: 'TLA12000000-CMR',
          revision_id: 1
        }
      }])

    const response = await associationSourceDelete({
      conceptType: 'Tool',
      conceptId: 'T12000000',
      collectionConceptIds: [
        {
          conceptId: 'C12000000'
        }
      ]
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      toolAssociation: {
        concept_id: 'TLA12000000-CMR',
        revision_id: 1
      }
    })
  })

  test('catches errors received from associationDelete', async () => {
    nock(/example-cmr/)
      .delete(/search\/tools\/T12000000\/associations/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      associationSourceDelete({
        conceptType: 'Tool',
        conceptId: 'T12000000',
        collectionConceptIds: [
          {
            conceptId: 'C12000000'
          }
        ]
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})
