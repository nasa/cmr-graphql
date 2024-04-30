import { rule } from 'graphql-shield'

import { hasPermission } from '../../utils/hasPermission'
import { forbiddenError } from '../../utils/forbiddenError'

/**
 * Check to see if the user can close an order for a given provider using
 * the cmr permissions api. In order to close an order, the user must have the create
 * permission on the PROVIDER_ORDER_CLOSURE target for the provider.
 * @method
 * @return {(true|ForbiddenError)}
 */
export const canCreateSystemGroups = rule()(async (parent, params, context) => {
  const { edlUsername } = context

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
})
