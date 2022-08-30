const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

/**
 * Verify and decode a JWT token
 * @param {String} header - The JWT token in the form "Bearer <TOKEN>"
 * @return {String} The User Id of the edl user if it has been verified, otherwise an empty string
 * @see https://urs.earthdata.nasa.gov/documentation/for_integrators/verify_edl_jwt_token
 */

// Retrieve all of the keysValue pairs from the JWKS env var
const client = jwksClient({
  getKeysInterceptor: () => {
    const rsaEnv = JSON.parse(process.env.rsaKey)
    return rsaEnv.keys
  }
})

const pubKey = async () => {
  // Retrieve the key id from the env
  const kid = process.env.edlKeyId

  // getSigningKey retreives the signing key obj which can access the public key
  const key = await client.getSigningKey(kid)

  // Decrypt the 'n' key in the JWK to get the public key used for verification of JWT token
  return key.getPublicKey()
}

export const verifyEDLJwt = async (header) => {
  // Edl token is in the form of Bearer <Token> retrieve <token>
  const bearerHeader = header.split(' ')
  const [, token] = bearerHeader

  const key = await pubKey()

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
