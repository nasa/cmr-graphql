import axios from 'axios'
/**
 * Make a request to EDL to verify the authenticity of a token
 * Retrieve the UID for a client based on that token
 * @param {Object} params
 */
export const verifyEdlToken = async (bearerToken) => {
  const bearerHeader = bearerToken.split(' ') // Edl token is in the form of Bearer <Token> we just want the token

  const [, edlToken] = bearerHeader
  // TODO: Reomve this debug code
  // (^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]$)
  // console.log('The EDL token we are regexing against', edlToken)
  // const regex = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*/

  // // const result = JSON.stringify(edlToken)
  // // console.log('stringified', result)
  // const match = regex.test(edlToken)
  // console.log('Matching the regex for JWT tokens ', match)

  // Default headers
  let userId = ''
  try {
    const response = await axios({
      method: 'POST',
      url: `${process.env.ursRootUrl}/oauth/tokens/user?client_id=${process.env.edlClientId}&token=${edlToken}`
    })
    // TODO: try to remove this semi colon issue comes from the destructuring assingment I think the test covereage issue here is from the defaul assignment
    // Can response ever do that though, return a value where data is empty
    const { data } = response;
    ({ uid: userId } = data)
  } catch (error) {
    console.log(`Could not complete request due to error: ${error}`)
  }
  // TODO: remove these debug lines
  // console.log('The data from the response', data)
  console.log('The user id from the response', userId)
  return userId
}
