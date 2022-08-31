const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

/**
 * Verify and decode a JWT token
 * @param {String} header - The JWT token in the form "Bearer <TOKEN>"
 * @return {String} The User Id of the edl user if it has been verified, otherwise an empty string if verification fails
 * @see https://urs.earthdata.nasa.gov/documentation/for_integrators/verify_edl_jwt_token
 * @see https://github.com/auth0/node-jwks-rsa
 */

export const verifyEDLJwt = async (header) => {
  // Edl token is in the form of Bearer <Token> retrieve <token>
  const kid = process.env.edlKeyId
  const bearerHeader = header.split(' ')
  const [, token] = bearerHeader

  // Retrieve all of the keysValue pairs from the JWKS env var return jwksClient obj
  const client = jwksClient({
    getKeysInterceptor: () => {
      const rsaEnv = JSON.parse(process.env.rsaKey)
      return rsaEnv.keys
    }
  })

  // getSigningKey retrieves the signing key obj which can access the public key
  const signKey = await client.getSigningKey(kid)

  // Decrypt the 'n' key in the JWK to get the public key used for verification of JWT token
  const pubKey = signKey.getPublicKey()

  const decodedToken = jwt.verify(token, pubKey, { algorithms: ['RS256'] }, (err, decoded) => {
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
