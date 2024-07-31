import { rule } from 'graphql-shield'

import { hasPermission } from '../../utils/hasPermission'
import { forbiddenError } from '../../utils/forbiddenError'

/**
 * Check to see if the user can create system groups using
 * the cmr permissions api. In order to create system groups, the user must have the `create`
 * permission on the GROUP system_object.
 * @method
 * @return {(true|ForbiddenError)}
 */
export const canCreateSystemGroups = rule()(async (parent, params, context) => {
  const { edlUsername } = context

  const { tag } = params

  // If the tag is CMR, perform check to see if the user has access to system group.
  if (tag === 'CMR') {
    if (
      await hasPermission(
        context,
        {
          permissions: 'create',
          permissionOptions: {
            user_id: edlUsername,
            system_object: 'GROUP'
          }
        }
      )
    ) return true

    return forbiddenError('Not authorized to perform [create] on system object [GROUP]')
  }

  return true
})
