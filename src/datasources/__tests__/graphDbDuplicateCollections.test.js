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

    process.env.ursRootUrl = 'http://example-urs.com'
    process.env.edlClientId = 'edl-client-id'
    process.env.graphdbHost = 'http://example-graphdb.com'
    process.env.graphdbPort = '8182'
    process.env.graphdbPath = ''
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('duplicate collections', () => {
    test('returns the parsed graphDb response', async () => {
      nock(/example-graphdb/)
        .post(() => true)
        .reply(200, duplicatedCollectionsGraphdbResponseMocks)

      // Mock the EDL call to retrieve the client's permitted groups
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

      const response = await graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: {
            doi: 'mock doi'
          }
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'someEdlUsername'
        }
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
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          },
          edlUsername: 'someEdlUsername'
        }
      )

      expect(response).toEqual({
        count: 0,
        items: []
      })
    })
  })

  test('Test that the returned groups are what they are supposed to be', async () => {
    nock(/example-graphdb/)
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

    const response = await graphDbDuplicateCollectionsDatasource(
      {
        conceptId: 'C1200383041-CMR_ONLY',
        shortName: 'mock shortname',
        doi: {
          doi: 'mock doi'
        }
      },
      {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        edlUsername: 'someEdlUsername'
      }
    )

    expect(response).toEqual(duplicateCollectionsRelatedUrlTypeResponseMocks)
  })
})
