import camelcaseKeys from 'camelcase-keys'

import { edlRequest } from '../utils/edlRequest'
import { parseError } from '../utils/parseError'
import { edlPathTypes } from '../constants'

export const fetchGroup = async (params, context, requestInfo) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await edlRequest({
      headers,
      method: 'GET',
      params,
      pathType: edlPathTypes.FIND_GROUP,
      requestInfo
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

export const searchGroup = async (params, context, requestInfo) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await edlRequest({
      headers,
      method: 'GET',
      params,
      pathType: edlPathTypes.SEARCH_GROUPS,
      requestInfo
    })

    // Format the returned data to match the schema
    const camelcasedData = camelcaseKeys(result.data, { deep: true })

    // Include `count` and `items` to match the schema's groupList
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

export const listGroupMembers = async (params, context, requestInfo) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await edlRequest({
      headers,
      method: 'GET',
      params,
      pathType: edlPathTypes.FIND_MEMBERS,
      requestInfo
    })

    // Format the returned data to match the schema
    const camelcasedData = camelcaseKeys(result.data?.users, { deep: true })

    // Include `count` and `items` to match the schema's groupList
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

export const createGroup = async (params, context, requestInfo) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await edlRequest({
      headers,
      method: 'POST',
      params,
      pathType: edlPathTypes.CREATE_GROUP,
      requestInfo
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

export const deleteGroup = async (params, context, requestInfo) => {
  const { headers } = context

  try {
    // Send the request to EDL
    const result = await edlRequest({
      headers,
      method: 'DELETE',
      params,
      pathType: edlPathTypes.DELETE_GROUP,
      requestInfo
    })

    return result.status === 200
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const updateGroup = async (params, context, requestInfo) => {
  const { headers } = context

  try {
    // Send the request to EDL
    // This will throw an error if the request fails
    await edlRequest({
      headers,
      method: 'POST',
      params,
      pathType: edlPathTypes.UPDATE_GROUP,
      requestInfo
    })

    // The update response does not include the group, so we have to query EDL again
    const updatedGroup = await edlRequest({
      headers,
      method: 'GET',
      params,
      pathType: edlPathTypes.FIND_GROUP,
      requestInfo
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
