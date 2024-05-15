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

    const { data: groups } = result

    // Format the returned data to match the schema
    const camelcasedData = camelcaseKeys(groups, { deep: true })

    const { params: searchParams } = params
    const {
      excludeTags,
      limit = 20,
      offset = 0,
      tags,
      wildcardTags
    } = searchParams
    let filteredData = camelcasedData

    // EDL does a wildcard-ish search with the `tags` parameter, but that isn't ideal. By default we want
    // the `tags` parameter to be exact, and the user should opt-in to a wildcard search by setting
    // `wildcardTags` to `true`.
    //
    // If `wildcardTags` is falsey, narrow the results to exact matches of the `tags` parameter (if it exists).
    if (tags && !wildcardTags) {
      filteredData = camelcasedData.filter((group) => tags.includes(group.tag))
    }

    // If the `excludeTags` parameter is included, only return groups that do not match the values provided
    if (excludeTags) {
      filteredData = filteredData.filter((group) => !excludeTags.includes(group.tag))
    }

    // Fake paging until EDL supports paging parameters
    const limitedData = filteredData.slice(offset, offset + limit)

    // Update the data to use `id` instead of `groupId`
    const updatedData = limitedData.map((group) => renameEdlId(group, 'groupId'))

    // Include `count` and `items` to match the schema's groupList
    return {
      // Return the full length before our fake paging
      count: filteredData.length,
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
