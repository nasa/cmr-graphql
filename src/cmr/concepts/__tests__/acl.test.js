import nock from 'nock'

import { parseRequestedFields } from '../../../utils/parseRequestedFields'
import Acl from '../acl'

process.env.cmrRootUrl = 'http://example.com'

describe('Acl concept', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()
  })

  describe('when fetching without params defined', () => {
    test('requests the json with the default params', async () => {
      nock('http://example.com')
        .get(/access-control\/acls/)
        .reply(200, { data: 'test' })

      const parsedInfo = {
        name: 'acls',
        alias: 'acls',
        args: {},
        fieldsByTypeName: {
          AclList: {
            count: {},
            items: {}
          }
        }
      }

      const requestInfo = parseRequestedFields(parsedInfo, {}, 'acl')

      const acl = new Acl({}, requestInfo, {})

      await acl.fetch()

      const response = await acl.response

      expect(await response[0].config.url).toEqual('http://example.com/access-control/acls?include_full_acl=true')
    })
  })

  describe('when fetching with params defined', () => {
    test('requests the json with the correct params including defaults', async () => {
      nock('http://example.com')
        .get(/access-control\/acls/)
        .reply(200, { data: 'test' })

      const parsedInfo = {
        name: 'acls',
        alias: 'acls',
        args: {
          params: {
            permittedUser: 'test'
          }
        },
        fieldsByTypeName: {
          AclList: {
            count: {},
            items: {}
          }
        }
      }

      const requestInfo = parseRequestedFields(parsedInfo, {}, 'acl')

      const acl = new Acl({}, requestInfo, {})

      await acl.fetch({
        params: {
          permittedUser: 'test'
        }
      })

      const response = await acl.response

      expect(await response[0].config.url).toEqual('http://example.com/access-control/acls?permitted_user=test&include_full_acl=true')
    })
  })
})
