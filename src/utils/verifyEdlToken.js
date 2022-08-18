import axios from 'axios'
/**
 * Make a request to EDL to verify the authenticity of a token
 * Retrieve the UID for a client based on that token
 * @param {Object} params
 */
export const verifyEdlToken = async (bearerToken) => {
  const bearerHeader = bearerToken.split(' ') // Edl token is in the form of Bearer <Token> we just want the token

  const edlToken = bearerHeader[1] // TODO: edl Token should have another value

  // Default headers
  let response = {}
  try {
    response = await axios({
      method: 'POST',
      url: `${process.env.ursRootUrl}/oauth/tokens/user?client_id=${process.env.mockClientId}&token=${edlToken}`
    })
  } catch (error) {
    console.log(`Could not complete request due to error: ${error}`)
  }
  const { data = {} } = response
  const { uid: userID = {} } = data
  // TODO: remove these debug lines
  // console.log('The data from the response', data)
  // console.log('The user id from the response', userID)

  return userID
}
