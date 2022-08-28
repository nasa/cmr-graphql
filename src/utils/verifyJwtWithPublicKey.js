const jwksClient = require('jwks-rsa')
const jwt = require('jsonwebtoken')

const client = jwksClient({
  getKeysInterceptor: () => {
    const rsaEnv = process.env.rsaKey
    // console.log('The clients rsa env', rsaEnv)
    const output = JSON.parse(rsaEnv)
    // console.log('The parsed rsa Env that was working at least before \n ', output)
    // console.log('Here are the output keys', output.keys)
    return output.keys
  }
})

const pubKey = async () => {
  const rsaEnv = process.env.rsaKey
  const output = JSON.parse(rsaEnv)

  // Destructure the kid value from the RSA token default to empty string
  const [{ kid = '' }] = output.keys

  const key = await client.getSigningKey(kid)
  return key.getPublicKey()
}

export const verifyEDLJwt = async (header) => {
  // Edl token is in the form of Bearer <Token> retrieve <token>
  const bearerHeader = header.split(' ')
  const [, token] = bearerHeader

  const key = await pubKey()

  // Grab RSA key from env variable
  const decodedToken = jwt.verify(token, key, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        console.log('JWT Token Expired, Invalid token')
      } else if (err.name === 'JsonWebTokenError') {
        console.log('Error Decoding JWT Token, Invalid token')
      }
      return {}
    }
    console.log('JWT Token validated successfully')
    console.log(decoded)
    return decoded
  })

  const { uid: userId = '' } = decodedToken
  // console.log('UserId returned from the decoded token', userId)
  return userId
}
