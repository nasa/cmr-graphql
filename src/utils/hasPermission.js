import { castArray } from 'lodash'
import { fetchPermissions } from './fetchPermissions'

/**
 * Checks if a user has a permission
 * @param {object} context The lambda context
 * @param {HasPermOptions} options The options
 * @return {(Boolean|Object)} a mapping of the target id's to their values, or a boolean representing
 *    permission across all target id's
 */
export const hasPermission = async (context, options = {}) => {
  const {
    permissions,
    permissionOptions,
    returnTargetIds = false
  } = options

  // Return false if minimum configuration options are not provided
  if (!permissions || !permissionOptions) return false

  // Fetch the permissions
  const userPermissions = await fetchPermissions(permissionOptions, context)
  // Example `userPermissions`: { TARGET: [ 'read' ] }

  if (!userPermissions) return false

  // Create a map where the value indicates whether the permissions exists for
  // each key in the permissions object
  const userPermissionsEntries = Object.entries(userPermissions)
  // Example `userPermissionsEntries`: [ [ 'TARGET', [ 'read' ] ] ]

  const mappedEntries = userPermissionsEntries.map(([key, value]) => (
    [
      key,
      castArray(permissions).every((permission) => value.includes(permission))
    ]
  ))
  // Example `mappedEntries`: [ [ 'TARGET', true ] ]

  const hasPermissionByTargetIdMap = Object.fromEntries(mappedEntries)
  // Example `hasPermissionByTargetIdMap`: { TARGET: true }

  // Check if the function should return target ids. If so, return the entire object
  if (returnTargetIds) return hasPermissionByTargetIdMap

  // If the target ids should not be returned, check that every value in the
  // object is true and return a boolean
  return Object.values(hasPermissionByTargetIdMap).every((value) => value)
}
