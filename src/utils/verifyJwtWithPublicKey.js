const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

/**
 * Verify and decode a JWT token
 * @param {String} header - The JWT token in the form "Beareer <TOKEN>"
 * @return {String} The User Id of the edl user if it has been verified, otherwise an empty string
 * @see https://urs.earthdata.nasa.gov/documentation/for_integrators/verify_edl_jwt_token
 */

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

  // Using the getSigningKey, retrieve the signing key that matches a specific kid
  const key = await client.getSigningKey(kid)
  return key.getPublicKey()
}

export const verifyEDLJwt = async (header) => {
  const rsaEnv = JSON.parse(process.env.rsaKey)

  // Edl token is in the form of Bearer <Token> retrieve <token>
  const bearerHeader = header.split(' ')
  const [, token] = bearerHeader

  const key = await pubKey(rsaEnv)

  const decodedToken = jwt.verify(token, key, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.log('Error Decoding JWT Token, Invalid token')
      return {}
    }
    console.log('JWT Token validated successfully')
    return decoded
  })

  // Destructure uid from the decoded token
  const { uid: userId = '' } = decodedToken

  return userId
}
