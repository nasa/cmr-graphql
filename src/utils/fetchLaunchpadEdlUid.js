import axios from 'axios'

/**
 * Uses the EDL API to retrieve the user's EDL UID given their launchpad token.
 * @param {String} launchpadToken User's launchpad token
 * @param {String} clientToken The EDL Client token
 * @returns The user's EDL UID
 */
const fetchLaunchpadEdlUid = async (launchpadToken, clientToken) => {
  const { ursRootUrl } = process.env

  const url = `${ursRootUrl}/api/nams/edl_user_uid`
  const authorizationHeader = `Bearer ${clientToken}`

  const response = await axios.post(url, `token=${launchpadToken}`, {
    headers: {
      Authorization: authorizationHeader,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })

  const { data } = response
  const { uid } = data

  return uid
}

export default fetchLaunchpadEdlUid
