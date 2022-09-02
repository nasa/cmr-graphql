import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { verifyEDLJwt } from '../verifyEDLJwt'

const OLD_ENV = process.env
beforeEach(() => {
  process.env = { ...OLD_ENV }

  // A Mock JWK
  process.env.edlJwk = '{"keys":[{"kty":"RSA","n":"some_cryptographic_hash","e":"AQAB","kid":"fakeKeyId"}]}'

  // a mock key id
  process.env.edlKeyId = 'fakeKeyId'
})

afterEach(() => {
  process.env = OLD_ENV
  jest.resetAllMocks()
})

describe('Correct JWT token', () => {
  test('Verifies a correct jwt token', async () => {
    // Mock the output of the jwt.verification function to return a valid value
    const mockJwtVerify = jest.spyOn(jwt, 'verify')
    mockJwtVerify.mockImplementationOnce(() => ({ uid: 'someUserId' }))

    // Run the function, verify that the uid matches the input
    const returnObject = await verifyEDLJwt('Bearer asdf.qwer.hjkl')

    expect(returnObject).toEqual('someUserId')
  })
})

describe('Thowing an error', () => {
  test('Verifies an expired jwt token', async () => {
    // Mock the output of the jwt.verification function to return a valid value
    const mockJwtVerify = jest.spyOn(jwt, 'verify')
    mockJwtVerify.mockImplementationOnce(() => { throw new TokenExpiredError() })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    // Run the function, verify that the uid matches the input
    await expect(
      verifyEDLJwt('Bearer asdf.qwer.hjkl')
    ).rejects.toThrow(Error)

    expect(consoleMock).toBeCalledWith('TokenExpiredError')
  })

  test('Checks against a malformed or invalid bearer token', async () => {
    // Mock the output of the jwt.verification function to return a valid value
    const mockJwtVerify = jest.spyOn(jwt, 'verify')
    mockJwtVerify.mockImplementationOnce(() => { throw new JsonWebTokenError() })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    // Run the function, verify that the uid matches the input
    await expect(
      verifyEDLJwt('Bearer asdf.qwer.hjkl')
    ).rejects.toThrow(Error)

    expect(consoleMock).toBeCalledWith('JsonWebTokenError')
  })

  test('checking against an unknown error jwt token', async () => {
    // Mock the output of the jwt.verification function to return a valid value
    const mockJwtVerify = jest.spyOn(jwt, 'verify')
    mockJwtVerify.mockImplementationOnce(() => { throw new Error('Unknown Error') })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    // Run the function, verify that the uid matches the input
    await expect(
      verifyEDLJwt('Bearer asdf.qwer.hjkl')
    ).rejects.toThrow(Error)

    expect(consoleMock).toBeCalledWith('Error: Unknown Error')
  })
})
