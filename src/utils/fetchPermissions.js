import qs from 'qs'
import axios from 'axios'

/**
 * Fetch permissions from the cmr permissions api based on concept_id, system_object,
 * or provider and target.
 * @method
 * @async
 * @param {string} userId URS user id
 * @param {(
 *  PermReqOpt_Concept
 *  |PermReqOpt_SystemObject
 *  |PermReqOpt_ProviderTarget
 * )} options The query options
 * @param {object} context The lambda context
 * @return {object} Boolean representing a users permission for the given target
 * @see https://cmr.earthdata.nasa.gov/access-control/site/docs/access-control/api.html#get-permissions
 */
export const fetchPermissions = async (options, context) => {
  const { clientId, requestId } = context

  const params = qs.stringify(options, {
    arrayFormat: 'brackets'
  })

  const url = `${process.env.cmrRootUrl}/access-control/permissions?${params}`

  try {
    const response = await axios.get(url, {
      headers: {
        'Client-Id': clientId,
        'X-Request-Id': requestId
      }
    })

    return response.data
  } catch (error) {
    console.log('Error fetching permissions', error)

    return false
  }
}
