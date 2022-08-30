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

  let response = {}
  try {
    response = await axios({
      headers: permittedHeaders,
      method: 'GET',
      url: `${process.env.ursRootUrl}/api/user_groups/groups_for_user/${edlUsername}?client_id=${process.env.edlClientId}`
    })
    const { data } = response

    const { user_groups: userGroups = [] } = data

    userGroups.forEach((userGroup) => {
      // Gremlin requires that the entries be surrounded by strings to be interpreted by the graphDb server
      const formattedUserGroupId = `'${userGroup.group_id}'`

      permittedUserGroups.push(formattedUserGroupId)
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

  // Useful for Debugging!
  // console.log('The permitted groups for this user', permittedUserGroups)

  return permittedUserGroups
}
