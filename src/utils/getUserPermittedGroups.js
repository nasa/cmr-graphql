import axios from 'axios'
import { pickIgnoringCase } from './pickIgnoringCase'
/**
 * Make a request to EDL to retrieve the user groups that a client is apart of
 * @param {Object} params
 * @param {String} edlUsername The EDL username of the client
 */
export const getUserPermittedGroups = async (headers, edlUsername) => {
  // Default headers
  const defaultHeaders = {}
  const permittedUserGroups = []

  const permittedHeaders = pickIgnoringCase({
    ...defaultHeaders,
    ...headers
  }, [
    'Accept',
    'Client-Id',
    'CMR-Request-Id',
    'Authorization'
  ])
  // process.env.cmrRootUrlTest
  // const { 'Authorization': authorization } = permittedHeaders
  // const clientId = process.env.edlClientId
  // const ursUrl = process.env.ursRootUrl
  // TODO: remove this debugging code
  // console.log('Client id being passed into http', clientId)
  // console.log('URs url being sent to the http ', ursUrl)
  // console.log('The edlUsername passing to the http', edlUsername)
  // console.log('The authorization passing to the http', permittedHeaders)
  // console.log('The client_id passing to the http', clientId)
  let response = {}
  try {
    response = await axios({
      headers: permittedHeaders,
      method: 'GET',
      url: `${process.env.ursRootUrl}/api/user_groups/groups_for_user/${edlUsername}?client_id=${process.env.edlClientId}`
    })
    const { data } = response
    const { user_groups: userGroups = [] } = data
    // console.log('The data from the response', data)
    // console.log('The data from the response', userGroups)
    userGroups.forEach((userGroup) => {
      // console.log('Current group ', userGroup.group_id)
      // Gremlin requires that the entries be surrounded by strings to be interpreted by the graphDb server
      const formatedUsrGroupId = `'${userGroup.group_id}'`
      // console.log('current userGroup', userGroup.group_id)
      permittedUserGroups.push(formatedUsrGroupId)
    })
    // If edl returns without problems client is granted registered access to collections as well
    const registeredGroup = '\'registered\''
    permittedUserGroups.push(registeredGroup)
  } catch (error) {
    console.log(`Could not complete request due to error: ${error}`)
  }

  // All clients have access to the guest group; including those who are not validated by EDL
  const guestGroup = '\'guest\''
  permittedUserGroups.push(guestGroup)

  // TODO: remove comment from final PR
  console.log('The permitted groups for this user', permittedUserGroups)

  return permittedUserGroups
}
