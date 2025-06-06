import nock from 'nock'

import fetchEdlClientToken from '../fetchEdlClientToken'

beforeEach(() => {
  process.env = {
    edlUid: 'mock-client',
    edlPassword: 'mock-password',
    ursRootUrl: 'https://example-urs.com'
  }
})

describe('Retrieving EDL Client Token', () => {
  test('returns token', async () => {
    nock(/example-urs/, 'grant_type=client_credentials')
      .post(/oauth\/token/)
      .matchHeader('Authorization', `Basic ${Buffer.from('mock-client:mock-password').toString('base64')}`)
      .reply(200, {
        access_token: 'mock_token',
        token_type: 'Bearer',
        expires_in: 1296000
      })

    const token = await fetchEdlClientToken()

    expect(token).toEqual('mock_token')
  })

  test('returns undefined when the response from EDL is an error', async () => {
    nock(/example-urs/, 'grant_type=client_credentials')
      .post(/oauth\/token/)
      .matchHeader('Authorization', `Basic ${Buffer.from('mock-client:mock-password').toString('base64')}`)
      .reply(400)

    const token = await fetchEdlClientToken()
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 400')
      })

    expect(token).toEqual(undefined)
  })
})
