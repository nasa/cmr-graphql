import nock from 'nock'

import graphDbDuplicateCollectionsDatasource from '../graphDbDuplicateCollections'

import duplicatedCollectionsGraphdbResponseMocks from './__mocks__/duplicateCollections.graphdbResponse.mocks'
import duplicateCollectionsRelatedUrlTypeResponseMocks from './__mocks__/duplicateCollections.response.mocks'

describe('graphDb', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
    process.env.ursRootUrl = 'http://example.com'
    process.env.edlClientId = 'adfadsfagaehrgaergaergareg'
    process.env.graphdbHost = 'http://example.com'
    process.env.graphdbPort = '8182'
    process.env.graphdbPath = ''

    process.env.ursRootUrl = 'http://example.com'
    process.env.edlClientId = 'adfadsfagaehrgaergaergareg'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('duplicate collections', () => {
    test('returns the parsed graphDb response', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(() => true)
        .reply(200, duplicatedCollectionsGraphdbResponseMocks)

      // Mock the EDL call to retrieve the client's permitted groups
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

      const response = await graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: {
            doi: 'mock doi'
          }
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        'someEdlUsername'
      )

      expect(response).toEqual(duplicateCollectionsRelatedUrlTypeResponseMocks)
    })

    test('returns 0 collections when doi doesn\'t exist', async () => {
      const response = await graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: null
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        'someEdlUsername'
      )

      expect(response).toEqual({
        count: 0,
        items: []
      })
    })
  })

  test('Test that the returned groups as what they are supposed to be', async () => {
    nock(/example/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .post(() => true, (body) => {
        const { gremlin: gremlinQuery } = body
        const correctGremlin = gremlinQuery.includes('within(\'groupid1\',\'groupid2\',\'registered\',\'guest\')')
        if (correctGremlin) {
          return true
        }
        return false
      })
      .reply(200, duplicatedCollectionsGraphdbResponseMocks)

    // Mock the EDL call to retrieve the client's permitted groups
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

    const response = await graphDbDuplicateCollectionsDatasource(
      {
        conceptId: 'C1200383041-CMR_ONLY',
        shortName: 'mock shortname',
        doi: {
          doi: 'mock doi'
        }
      },
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      'someEdlUsername'
    )

    expect(response).toEqual(duplicateCollectionsRelatedUrlTypeResponseMocks)
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
      graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: {
            doi: 'mock doi'
          }
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        'someEdlUsername'
      )
    ).rejects.toThrow(Error)
  })
})
