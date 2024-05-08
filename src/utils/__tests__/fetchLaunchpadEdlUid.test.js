import nock from 'nock'

import fetchLaunchpadEdlUid from '../fetchLaunchpadEdlUid'

describe('fetchLaunchpadEdlUid', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      ursRootUrl: 'https://example-urs.com'
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('returns uid', async () => {
    nock(/example-urs/, 'token=mock-launchpad-token')
      .post(/api\/nams\/edl_user_uid/)
      .matchHeader('Authorization', 'Bearer mock-client-token')
      .reply(200, {
        uid: 'mock-uid'
      })

    const token = await fetchLaunchpadEdlUid('mock-launchpad-token', 'mock-client-token')

    expect(token).toEqual('mock-uid')
  })

  test('returns null for the local MMT', async () => {
    process.env.IS_OFFLINE = true
    const token = await fetchLaunchpadEdlUid('ABC-1', 'mock-client-token')

    expect(token).toBeNull()
  })

  test('returns undefined when the response from EDL is an error', async () => {
    nock(/example-urs/, 'grant_type=client_credentials')
      .post(/api\/nams\/edl_user_uid/)
      .matchHeader('Authorization', 'Bearer mock-client-token')
      .reply(400)

    const token = await fetchLaunchpadEdlUid('mock-launchpad-token', 'mock-client-token')
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400')
      })

    expect(token).toEqual(undefined)
  })
})
