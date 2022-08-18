import nock from 'nock'

import { verifyEdlToken } from '../verifyEdlToken'

describe('Verify an edl token and retrieve a uid', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
    process.env.ursRootUrl = 'http://example.com'
    process.env.mockClientId = 'clientIdOfSomeApplication'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('If the token was verified and correctly returns the uid', async () => {
    nock(/example/)
      .post(/oauth\/tokens/)
      .reply(200, { uid: 'someone' })

    const returnObject = await verifyEdlToken('Bearer asdfjlfasdjklfjlkasdfjlasdfa')

    expect(returnObject).toEqual('someone')
  })

  test('If the token was NOT valid will return an error', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
    nock(/example/)
      .post(/oauth\/tokens/)
      .reply(403, {})

    const returnObject = await verifyEdlToken('Bearer aBadToken')

    expect(returnObject).toEqual({})

    expect(consoleMock).toBeCalledWith('Could not complete request due to error: Error: Request failed with status code 403')
  })
})
