import nock from 'nock'

import graphDbDuplicateCollectionsDatasource from '../graphDbDuplicateCollections'

import duplicatedCollectionsGraphdbResponseMocks from './__mocks__/duplicateCollections.graphdbResponse.mocks'
import duplicateCollectionsRelatedUrlTypeResponseMocks from './__mocks__/duplicateCollections.response.mocks'
// TODO: I need to add a uuid that gets passed to all of these tests
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
    process.env.mockClientId = 'adfadsfagaehrgaergaergareg'
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
        // TODO: how can I grab this value that is being posted out and parse it
        // TODO: delete this later
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
        'someUid' // TODO: I put this uuid here since it is getting passed from the context
      )

      expect(response).toEqual(duplicateCollectionsRelatedUrlTypeResponseMocks)
    })

    test('returns 0 collections when doi does not exist', async () => {
      const response = await graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: null
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        'someUid' // TODO: UUID from the context
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
      .post(/graphdb/, (body) => { // TODO: This gets out the body being sent out by the post request
        const { gremlin: gremlinQuery } = body
        console.log(gremlinQuery)
        const correctGremlin = gremlinQuery.includes('within(\'groupid1\',\'groupid2\',\'guest\')')
        if (correctGremlin) {
          console.log('We have the groups where we want them')
          return true
        }
        return false
      })
      .reply(200, duplicatedCollectionsGraphdbResponseMocks)
      // TODO: delete this later
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
      'someUid' // TODO: I put this uuid here since it is getting passed from the context
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
      }) // TODO: I put this uuid here since it is getting passed from the context

    await expect(
      graphDbDuplicateCollectionsDatasource(
        {
          conceptId: 'C1200383041-CMR_ONLY',
          shortName: 'mock shortname',
          doi: {
            doi: 'mock doi'
          }
        },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }
      )
    ).rejects.toThrow(Error)
  })
})
