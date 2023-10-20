import nock from 'nock'

import { getUserPermittedGroups } from '../getUserPermittedGroups'

describe('Retrieve data from EDL on the user groups', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    process.env.rsaKey = ''
    process.env.ursRootUrl = 'http://example-urs.com'
    process.env.edlClientId = 'clientIdOfSomeApplication'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('Retrieving correct data from the permitted groups', async () => {
    nock(/example-urs/)
      .get(/user_groups/)
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

    const returnObject = await getUserPermittedGroups('headers', 'SomeUid')

    // This single quote inside of string is how graphDb parses http requests
    const testGroupIds = ["'groupid1'", "'groupid2'", "'registered'", "'guest'"]
    expect(returnObject).toEqual(testGroupIds)
  })

  test('If the user has no groups they would still have guest and registered privillages', async () => {
    nock(/example-urs/)
      .get(/user_groups/)
      .reply(200, {
        user_groups: []
      })

    const returnObject = await getUserPermittedGroups('headers', 'SomeUid')

    // This single quote inside of string is how graphDb parses http requests
    const testGroupIds = ["'registered'", "'guest'"]
    expect(returnObject).toEqual(testGroupIds)
  })

  test('If the response has an issue and returns null the client should still have guest privillages ', async () => {
    nock(/example-urs/)
      .get(/user_groups/)
      .reply(400, null)

    const returnObject = await getUserPermittedGroups('headers', 'SomeUid')

    // Only guest group is added
    const testGroupIds = ["'guest'"]
    expect(returnObject).toEqual(testGroupIds)
  })

  test('If the response has an issue and returns null the client should still have guest privillages ', async () => {
    nock(/example-urs/)
      .get(/user_groups/)
      .reply(400, null)

    const returnObject = await getUserPermittedGroups('headers', '')

    // Only guest group is added
    const testGroupIds = ["'guest'"]
    expect(returnObject).toEqual(testGroupIds)
  })
})
