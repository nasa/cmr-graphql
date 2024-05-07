import nock from 'nock'

import fetchLaunchpadEdlUid from '../fetchLaunchpadEdlUid'

beforeEach(() => {
  process.env = {
    ursRootUrl: 'https://example-urs.com'
  }
})

describe('fetchLaunchpadEdlUid', () => {
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
