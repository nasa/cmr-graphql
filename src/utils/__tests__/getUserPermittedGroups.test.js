import nock from 'nock'

import { getUserPermittedGroups } from '../getUserPermittedGroups'

describe('Retrieve data from EDL on the user groups', () => {
  const OLD_ENV = process.env
  // We don't need to mock up CMR since this function never actually makes a call to it
  // TODO: What does this comment accomplish?
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    process.env.rsaKey = '' // TODO: how can I mock this part of the system up
    process.env.ursRootUrl = 'http://example.com'
    process.env.mockClientId = 'clientIdOfSomeApplication'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  // TODO: mock up the response
  test('Retrieving correct data from the permitted groups', async () => {
    nock(/example/)
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
    const testGroupIds = ["'groupid1'", "'groupid2'", "'guest'"]
    expect(returnObject).toEqual(testGroupIds)
  })

  test('If the user has no groups they would still have guest privillages', async () => {
    nock(/example/)
      .get(/user_groups/)
      .reply(200, {
        user_groups: []
      })
    const returnObject = await getUserPermittedGroups('headers', 'SomeUid')

    // This single quote inside of string is how graphDb parses http requests
    const testGroupIds = ["'guest'"]
    expect(returnObject).toEqual(testGroupIds)
  })
  // TODO: What should we do if there is a connection error how should we handle it? Should user still have group?
  test('If the response has an issue and returns null ', async () => {
    nock(/example/)
      .get(/user_groups/)
      .reply(400, null)
    const returnObject = await getUserPermittedGroups('headers', 'SomeUid')
    // TODO: This is supposed to equal some array of groups
    const testGroupIds = ["'guest'"]
    expect(returnObject).toEqual(testGroupIds)
  })
})
