const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const client = jwksClient({
  getKeysInterceptor: () => {
    const rsaEnv = JSON.parse(process.env.rsaKey)
    return rsaEnv.keys
  }
})

const pubKey = async (rsaEnv) => {
  // Destructure JWK
  const {
    keys: [
      {
        kid
      }
    ]
  } = rsaEnv

  const key = await client.getSigningKey(kid)
  return key.getPublicKey()
}

export const verifyEDLJwt = async (header) => {
  // Edl token is in the form of Bearer <Token> retrieve <token>
  const rsaEnv = JSON.parse(process.env.rsaKey)
  const bearerHeader = header.split(' ')
  const [, token] = bearerHeader

  const key = await pubKey(rsaEnv)

  // Grab RSA key from env variable
  const decodedToken = jwt.verify(token, key, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.log('Error Decoding JWT Token, Invalid token')
      return {}
    }
    console.log('JWT Token validated successfully')
    return decoded
  })

  // destructure uid from the decoded token
  const { uid: userId = '' } = decodedToken

  // TODO: remove but, useful for debugging
  // console.log('Edl user id', userId)

  return userId
}
