import axios from 'axios'
import { pickIgnoringCase } from './pickIgnoringCase'
/**
 * Make a request to EDL to retrieve the user groups that a client is apart of
 * @param {Object} params
 * @param {String} uid The EDL username of the client
 */
export const getUserPermittedGroups = async (headers, uId) => {
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
  // permittedHeaders.Authorization = 'mock-echo-system-token'
  // const { 'Authorization': authorization } = permittedHeaders
  // const clientId = process.env.mockClientId
  // const ursUrl = process.env.ursRootUrl
  // TODO: remove this debugging code
  // console.log('Client id being passed into http', clientId)
  // console.log('URs url being sent to the http ', ursUrl)
  // console.log('The uid passing to the http', uId)
  // console.log('The authorization passing to the h ttp', permittedHeaders)
  // console.log('The client_id passing to the http', clientId)
  // TODO: these Env vars should probably be renamed and changed in the test as well
  let response = {}
  try {
    response = await axios({
      headers: permittedHeaders,
      method: 'GET',
      url: `${process.env.ursRootUrl}/api/user_groups/groups_for_user/${uId}?client_id=${process.env.mockClientId}`
    })
  } catch (error) {
    console.log(`Could not complete request due to error: ${error}`)
  }
  const { data = {} } = response
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

  // TODO: verify that this should be the correct beahvaior all clients should have access to collections which have the 'guest' permittedGroup
  const guestGroup = '\'guest\''
  permittedUserGroups.push(guestGroup)
  console.log('The permitted groups for this user', permittedUserGroups)
  return permittedUserGroups
}
