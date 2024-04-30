import camelcaseKeys from 'camelcase-keys'

import { edlRequest } from '../utils/edlRequest'
import { parseError } from '../utils/parseError'
import { edlPathTypes } from '../constants'

/**
 * Renames the provided `idField` within the `data` object to be the `id` field.
 * @param {Object} data Object to update
 * @param {String} idField Previous field that will be set to `id`
 */
const renameEdlId = (data, idField) => ({
  ...data,
  id: data[idField]
})

export const fetchGroup = async (params, context, requestInfo) => {
  try {
    // Send the request to EDL
    const result = await edlRequest({
      context,
      method: 'GET',
      params,
      pathType: edlPathTypes.FIND_GROUP,
      requestInfo
    })

    // Format the returned data to match the schema
    return renameEdlId(camelcaseKeys(result.data, { deep: true }), 'groupId')
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const searchGroup = async (params, context, requestInfo) => {
  try {
    // Send the request to EDL
    const result = await edlRequest({
      context,
      method: 'GET',
      params,
      pathType: edlPathTypes.SEARCH_GROUPS,
      requestInfo
    })

    // Format the returned data to match the schema
    const camelcasedData = camelcaseKeys(result.data, { deep: true })

    const updatedData = camelcasedData.map((group) => renameEdlId(group, 'groupId'))

    // Include `count` and `items` to match the schema's groupList
    return {
      count: updatedData.length,
      items: updatedData
    }
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const listGroupMembers = async (params, context, requestInfo) => {
  try {
    // Send the request to EDL
    const result = await edlRequest({
      context,
      method: 'GET',
      params,
      pathType: edlPathTypes.FIND_MEMBERS,
      requestInfo
    })

    // Format the returned data to match the schema
    const camelcasedData = camelcaseKeys(result.data?.users, { deep: true })

    const updatedData = camelcasedData.map((group) => renameEdlId(group, 'uid'))

    // Include `count` and `items` to match the schema's groupList
    return {
      count: updatedData.length,
      items: updatedData
    }
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const createGroup = async (params, context, requestInfo) => {
  try {
    // Send the request to EDL
    const result = await edlRequest({
      context,
      method: 'POST',
      params,
      pathType: edlPathTypes.CREATE_GROUP,
      requestInfo
    })

    // Format the returned data to match the schema
    return renameEdlId(camelcaseKeys(result.data, { deep: true }), 'groupId')
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}

export const deleteGroup = async (params, context, requestInfo) => {
  try {
    // Send the request to EDL
    const result = await edlRequest({
      context,
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
  // The `tag` parameter should be `newTag in the EDL API, pull it out of params here and set it to newTag below.
  const { tag, ...filteredParams } = params

  try {
    // Send the request to EDL
    // This will throw an error if the request fails
    await edlRequest({
      context,
      method: 'POST',
      params: {
        ...filteredParams,
        newTag: tag
      },
      pathType: edlPathTypes.UPDATE_GROUP,
      requestInfo
    })

    // The update response does not include the group, so we have to query EDL again
    const updatedGroup = await edlRequest({
      context,
      method: 'GET',
      params,
      pathType: edlPathTypes.FIND_GROUP,
      requestInfo
    })

    // Format the returned data to match the schema
    return renameEdlId(camelcaseKeys(updatedGroup.data, { deep: true }), 'groupId')
  } catch (error) {
    return parseError(error, {
      reThrowError: true,
      provider: 'EDL'
    })
  }
}
