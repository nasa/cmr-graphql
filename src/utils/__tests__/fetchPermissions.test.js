import nock from 'nock'

import { fetchPermissions } from '../fetchPermissions'

process.env.cmrRootUrl = 'http://example.com'

describe('fetchPermissions', () => {
  test('calls CMR', async () => {
    const options = {
      user_id: 'test-user',
      system_object: 'GROUP'
    }
    const context = {
      clientId: 'mock-client-id',
      requestId: 'mock-request-id'
    }

    nock(/example/)
      .get(/access-control\/permissions\?user_id=test-user&system_object=GROUP/)
      .matchHeader('Client-Id', 'mock-client-id')
      .matchHeader('X-Request-Id', 'mock-request-id')
      .reply(200, { GROUP: ['READ'] })

    const result = await fetchPermissions(options, context)

    expect(result).toEqual({
      GROUP: [
        'READ'
      ]
    })
  })

  describe('when an error occurs', () => {
    test('logs an error message', async () => {
      const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {})

      const options = {
        user_id: 'test-user',
        system_object: 'GROUP'
      }
      const context = {
        clientId: 'mock-client-id',
        requestId: 'mock-request-id'
      }

      nock(/example/)
        .get(/access-control\/permissions\?user_id=test-user&system_object=GROUP/)
        .matchHeader('Client-Id', 'mock-client-id')
        .matchHeader('X-Request-Id', 'mock-request-id')
        .reply(400)

      const result = await fetchPermissions(options, context)

      expect(result).toEqual(false)

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Error fetching permissions', new Error('Request failed with status code 400'))
    })
  })
})
