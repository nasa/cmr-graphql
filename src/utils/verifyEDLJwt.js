import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

import { parseError } from './parseError'

/**
 * Verify and decode a JWT token
 * @param {String} header - The JWT token in the form "Bearer <TOKEN>"
 * @return {Promise<string>} The User Id of the edl user if it has been verified, otherwise an empty string if verification fails
 * @see https://urs.earthdata.nasa.gov/documentation/for_integrators/verify_edl_jwt_token
 * @see https://github.com/auth0/node-jwks-rsa
 */
export const verifyEDLJwt = async (header) => {
  // Edl token is in the form of Bearer <Token> retrieve <token>
  const keyId = process.env.edlKeyId

  try {
    const bearerHeader = header.split(' ')
    const [, token] = bearerHeader

    // Retrieve all of the keysValue pairs from the JWKS env var return jwksClient obj
    const client = jwksClient({
      getKeysInterceptor: () => {
        const edlJwk = JSON.parse(process.env.edlJwk)
        return edlJwk.keys
      }
    })

    // getSigningKey retrieves the signing key obj which can access the public key
    const signKey = await client.getSigningKey(keyId)

    // Decrypt the 'n' key in the JWK to get the public key used for verification of JWT token
    const pubKey = signKey.getPublicKey()

    // Attempt to verify the token using the public key
    const decodedToken = jwt.verify(token, pubKey, { algorithms: ['RS256'] })

    // Destructure uid from the decoded token
    const { uid } = decodedToken

    // Return the value provided by the token
    return uid
  } catch (e) {
    return parseError(e, { reThrowError: true, provider: 'EDL' })
  }
}
