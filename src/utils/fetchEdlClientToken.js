import axios from 'axios'

/**
 * The EDL client token is used for retrieving/modifying user/groups in URS.
 * @returns the EDL client token
 */
const fetchEdlClientToken = async () => {
  const {
    edlUid,
    edlPassword,
    ursRootUrl
  } = process.env

  const url = `${ursRootUrl}/oauth/token`
  const authorizationHeader = `Basic ${Buffer.from(`${edlUid}:${edlPassword}`).toString('base64')}`

  const response = await axios.post(url, 'grant_type=client_credentials', {
    headers: {
      Authorization: authorizationHeader,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })

  const { data } = response

  const { access_token: accessToken } = data

  return accessToken
}

export default fetchEdlClientToken
