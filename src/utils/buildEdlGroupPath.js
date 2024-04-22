/**
 * Returns a EDL api path based on the provided type, id and params.
 * @param {Object} params
 * @param {String} params.id ID parameter to send to EDL
 * @param {String} params.params Query parameters to send to EDL
 * @param {String} params.type Request type to send to EDL
 */
export const buildEdlGroupPath = ({
  id,
  params,
  type
}) => {
  const typeMap = {
    CREATE_GROUP: `/api/user_groups?${params}`,
    DELETE_GROUP: `/api/user_groups/${id}`,
    FIND_GROUP: `/api/user_groups/${id}`,
    FIND_MEMBERS: `/api/user_groups/group_members/${id}`,
    SEARCH_GROUPS: `/api/user_groups/search?${params}`,
    UPDATE_GROUP: `/api/user_groups/${id}/update?${params}`
  }

  return typeMap[type]
}
