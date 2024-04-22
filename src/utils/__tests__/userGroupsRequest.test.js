import nock from 'nock'
import { userGroupsRequest } from '../userGroupsRequest'
import { downcaseKeys } from '../downcaseKeys'

describe('userGroupsRequest', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.ursRootUrl = 'http://example-urs.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('when making a request to search for user groups', () => {
    test('queries EDL', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-urs/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .defaultReplyHeaders({
          'CMR-Took': 7
        })
        .get(/api\/user_groups\/search/)
        .reply(200, [{
          group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
          app_uid: 'mmt_test',
          client_id: '81FEem91NlTQreWv2UgtXQ',
          name: 'Test Group',
          description: 'Just a test group',
          shared_user_group: false,
          created_by: 'mmt_test',
          tag: 'MMT_2'
        }])

      const response = await userGroupsRequest({
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        method: 'GET',
        params: {
          params: {
            tags: ['MMT_2']
          }
        }
      })

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual([{
        group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
        app_uid: 'mmt_test',
        client_id: '81FEem91NlTQreWv2UgtXQ',
        name: 'Test Group',
        description: 'Just a test group',
        shared_user_group: false,
        created_by: 'mmt_test',
        tag: 'MMT_2'
      }])

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: userGroups] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when making a request to retrieve a single user group', () => {
    test('queries EDL', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-urs/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .defaultReplyHeaders({
          'CMR-Took': 7
        })
        .get(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195/)
        .reply(200, {
          group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
          app_uid: 'mmt_test',
          client_id: '81FEem91NlTQreWv2UgtXQ',
          name: 'Test Group',
          description: 'Just a test group',
          shared_user_group: false,
          created_by: 'mmt_test',
          tag: 'MMT_2'
        })

      const response = await userGroupsRequest({
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        method: 'GET',
        params: {
          params: {
            userGroupIdOrName: '90336eb8-309c-44f5-aaa8-1672765b1195'
          }
        }
      })

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
        app_uid: 'mmt_test',
        client_id: '81FEem91NlTQreWv2UgtXQ',
        name: 'Test Group',
        description: 'Just a test group',
        shared_user_group: false,
        created_by: 'mmt_test',
        tag: 'MMT_2'
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: userGroups] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when making a request to create a user group', () => {
    test('queries EDL', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-urs/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .defaultReplyHeaders({
          'CMR-Took': 7
        })
        .post(/api\/user_groups/)
        .reply(200, {
          group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
          app_uid: 'mmt_test',
          client_id: '81FEem91NlTQreWv2UgtXQ',
          name: 'Test Group',
          description: 'Just a test group',
          shared_user_group: false,
          created_by: 'mmt_test',
          tag: 'MMT_2'
        })

      const response = await userGroupsRequest({
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        method: 'POST',
        params: {
          name: 'Test Group',
          tag: 'MMT_2',
          description: 'Just a test group'
        }
      })

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        group_id: '90336eb8-309c-44f5-aaa8-1672765b1195',
        app_uid: 'mmt_test',
        client_id: '81FEem91NlTQreWv2UgtXQ',
        name: 'Test Group',
        description: 'Just a test group',
        shared_user_group: false,
        created_by: 'mmt_test',
        tag: 'MMT_2'
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: userGroups] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when making a request to update a user group', () => {
    test('queries EDL', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-urs/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .defaultReplyHeaders({
          'CMR-Took': 7
        })
        .post(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195\/update/)
        .reply(200, {
          description: 'Successfully updated user group Test Group'
        })

      const response = await userGroupsRequest({
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        method: 'POST',
        params: {
          userGroupIdOrName: '90336eb8-309c-44f5-aaa8-1672765b1195',
          description: 'Just a test group -- update'
        }
      })

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual({
        description: 'Successfully updated user group Test Group'
      })

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: userGroups] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })

  describe('when making a request to delete a user group', () => {
    test('queries EDL', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => vi.fn())

      nock(/example-urs/, {
        reqheaders: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      })
        .defaultReplyHeaders({
          'CMR-Took': 7
        })
        .delete(/api\/user_groups\/90336eb8-309c-44f5-aaa8-1672765b1195/)
        .reply(200)

      const response = await userGroupsRequest({
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        },
        method: 'DELETE',
        params: {
          id: '90336eb8-309c-44f5-aaa8-1672765b1195'
        }
      })

      const { data, headers } = response

      const {
        'request-duration': requestDuration
      } = downcaseKeys(headers)

      expect(data).toEqual('')

      expect(consoleMock).toBeCalledWith(
        `Request abcd-1234-efgh-5678 from eed-test-graphql to [concept: userGroups] completed external request in [observed: ${requestDuration} ms]`
      )
    })
  })
})
