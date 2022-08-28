import createJWKSMock from 'mock-jwks'
import { verifyEDLJwt } from '../verifyJwtWithPublicKey'

const OLD_ENV = process.env

describe('verifyEDLJwt', () => {
  const jwks = createJWKSMock('https://MYAUTH0APP.auth0.com/')
  beforeEach(() => {
    process.env = { ...OLD_ENV }
    // This token is from a local instance of EDL it is not a key on any cloud system
    process.env.rsaKey = '{"keys":[{"kty":"RSA","n":"xSxiOkM8m8oCyWn-sNNZxBVTUcPAlhXRjKpLTYIM21epMC9rqEnrgL7iuntmp3UcffOIKtFHOtCG-jWUkyzxZHPPMo0kYZVHKRjGj-AVAy3FA-d2AtUc1dPlrQ0TpdDoTzew_6-48BcbdFEQI3161wcMoy40unYYYfzo3KuUeNcCY3cmHzSkYn4iQHaBy5zTAzKTIcYCTpaBGDk4_IyuysvaYmgwdeNO26hNV9dmPx_rWgYZYlashXZ_kRLirDaGpnJJHyPrYaEJpMIWuIfsh_UoMjsyuoQGe4XU6pG8uNnUd31mHa4VU78cghGZGrCz_YkPydfFlaX65LBp9aLdCyKkA66pDdnCkm8odVMgsH2x_kGM7sNlQ6ELTsT-dtJoiEDI_z3fSZehLw469QpTGQjfsfXUCYm8QrGckJF4bJc935TfGU86qr2Ik2YoipP_L4K_oqUf8i6bwO0iomo_C7Ukr4l-dh4D5O7szAb9Ga804OZusFk3JENlc1-RlB20S--dWrrO-v_L8WI2d72gizOKky0Xwzd8sseEqfMWdktyeKoaW0ANkBJHib4E0QxgedeTca0DH_o0ykMjOZLihOFtvDuCsbHG3fv41OQr4qRoX97QO2Hj1y3EBYtUEypan46g-fUyLCt-sYP66RkBYzCJkikCbzF_ECBDgX314_0","e":"AQAB","kid":"edljwtpubkey_development"}]}'
    jwks.start()
  })

  afterEach(() => {
    process.env = OLD_ENV
    jwks.stop()
    jest.resetModules()
  })
  // To test correctly: I need to set the rsa key to some random value and my token to some random value
  test('Verifies a correct jwt token', async () => {
    // This token is from a local instance of EDL it is NOT a bearer token utilzied by cloud edl systems
    const token = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfZGV2ZWxvcG1lbnQiLCJhbGciOiJSUzI1NiJ9.eyJ0eXBlIjoiVXNlciIsImNsaWVudF9pZCI6ImxvY2FsZGV2IiwiZXhwIjoxMTY2MTU0NzA5NCwiaWF0IjoxNjYxNTQ3MDk0LCJpc3MiOiJFYXJ0aGRhdGEgTG9naW4iLCJ1aWQiOiJtc3RhcnR6ZWx0ZXN0ZXIifQ.tAA4zu2K3NFJVX96_M1qb1lrDQ1l7uMjMWNE5Jkxw16RnHTgIt6dcEdX-YcXUbJqKDU39RLcB_O8hgzd9e7pHBdxrwhjl4LnuNcSj1XZGTLh-RD5VW1jRkQe_pcH1noniUqkXaYuVGUybnbhDZa_37Oxs-vr0lT06Qk82elV5Y1dq_YLQeABv4O0BiktpPoCSjSIfTW6jEUS-ONk07r5N5O_Me7H-QbPhEtiax1N3zcTRWyNn7lM6vQxl7d-ywRKqQaeA9Iy-ufmGXoczLvvN4HsaKbVhQ_llw6Xnj7cKpd4WJ6VABDETlMlcjwtyvSt-q3aToy9N4_EkMGQbxkbsQrvf9LI2VM7J799uhW9E4VvOEl-CafkFnOgjo1nvMpq3fZq1zIfG4eA6UrYpQQz_gcdFfoL-p5ZI_BbMO0PK_8XAfE8O0w7b7i7QJ_EmKKUA2QibJLK8qdlOhbLNu6ORTyqvxbawMAjW_ZzJIZnDwjyuIoJNBFJQxiz2SMBdQwAuJDGcyzIGEAheF0ffB-mJG28HyVvhbjQhP2ByE0mZoDFhqmgk47FnQNFL7mTdtSbI-KvOXb3rBEaELUdWDuqjgnOxQehJzFlbqETRZfZDuEUq7q1Zl227k2178lvVVPQuco8Auo180qVaJcAs9Fd2k-i6oNkalC6MNjgmEpBUSE'
    const passToken = `Bearer ${token}`
    const returnObject = await verifyEDLJwt(passToken)

    // This is an example uid from edl only
    expect(returnObject).toEqual('mstartzeltester')
  })

  test('Given a bad token console the error and return an empty list for the decoded token', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    // leverage the jwt library to create mock tokens and public key which will fail verification
    const fakeToken = jwks.token({})
    // const fakeKid = jwks.kid()
    // console.log('Mock Key identifier value' , fakeKid)
    const returnObject = await verifyEDLJwt(fakeToken)

    // This single quote inside of string is how graphDb parses http requests
    const decodedTestJwt = ''

    expect(consoleMock).toBeCalledWith(
      'Error Decoding JWT Token, Invalid token'
    )
    expect(returnObject).toEqual(decodedTestJwt)
  })
})
