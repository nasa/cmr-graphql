import { rule } from 'graphql-shield'

import { hasPermission } from '../../utils/hasPermission'
import { forbiddenError } from '../../utils/forbiddenError'

/**
 * Check to see if the user can create provider groups using
 * the cmr permissions api. In order to create provider groups, the user must have the `create`
 * permission on the GROUP provider_object.
 * @method
 * @return {(true|ForbiddenError)}
 */
export const canCreateProviderGroups = rule()(async (parent, params, context) => {
  const { edlUsername } = context

  const { tag } = params

  // If tag, perform check to see if the user has access to the given provider.
  if (tag && tag !== 'CMR') {
    if (
      await hasPermission(
        context,
        {
          permissions: 'create',
          permissionOptions: {
            provider: tag,
            target: 'GROUP',
            user_id: edlUsername
          }
        }
      )
    ) return true

    return forbiddenError('Not authorized to perform [create] on provider object [GROUP]')
  }

  return false
})
