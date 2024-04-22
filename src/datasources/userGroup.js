import camelcaseKeys from 'camelcase-keys'

import { userGroupsRequest } from '../utils/userGroupsRequest'
import { parseError } from '../utils/parseError'

export const fetchUserGroup = async (params, context) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await userGroupsRequest({
      headers,
      method: 'GET',
      params
    })

    // Format the returned data to match the schema
    return camelcaseKeys(result.data, { deep: true })
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const searchUserGroup = async (params, context) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await userGroupsRequest({
      headers,
      method: 'GET',
      params
    })

    // Format the returned data to match the schema
    const camelcasedData = camelcaseKeys(result.data, { deep: true })

    // Include `count` and `items` to match the schema's UserGroupList
    return {
      count: camelcasedData.length,
      items: camelcasedData
    }
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const createUserGroup = async (params, context) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await userGroupsRequest({
      headers,
      method: 'POST',
      params
    })

    // Format the returned data to match the schema
    return camelcaseKeys(result.data, { deep: true })
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const deleteUserGroup = async (params, context) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await userGroupsRequest({
      headers,
      method: 'DELETE',
      params
    })

    return result.status === 200
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const updateUserGroup = async (params, context) => {
  const { headers } = context

  try {
    // Send the request to EDL
    // This will throw an error if the request fails
    await userGroupsRequest({
      headers,
      method: 'POST',
      params
    })

    // The update response does not include the group, so we have to query EDL again
    const updatedGroup = await userGroupsRequest({
      headers,
      method: 'GET',
      params
    })

    // Format the returned data to match the schema
    return camelcaseKeys(updatedGroup.data, { deep: true })
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}
