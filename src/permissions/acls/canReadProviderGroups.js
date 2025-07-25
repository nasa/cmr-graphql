import { rule } from 'graphql-shield'

import { hasPermission } from '../../utils/hasPermission'
import { forbiddenError } from '../../utils/forbiddenError'

const ERROR = 'Not authorized to perform [read] on provider object [GROUP]'

/**
 * Check to see if the user can read provider groups using
 * the cmr permissions api. In order to read provider groups, the user must have the `read`
 * permission on the GROUP target.
 * @method
 * @return {(true|ForbiddenError)}
 */
export const canReadProviderGroups = rule()(async (parent, params, context) => {
  const { edlUsername } = context
  if (!edlUsername) {
    return forbiddenError(ERROR)
  }

  const { params: requestedParams = {} } = params

  const { tags = [] } = requestedParams

  const results = await Promise.all(tags.map(async (tag) => {
    if (
      await hasPermission(
        context,
        {
          permissions: 'read',
          permissionOptions: {
            provider: tag,
            target: 'GROUP',
            user_id: edlUsername
          }
        }
      )
    ) return true

    return false
  }))

  if (results.some((result) => !result)) {
    return forbiddenError(ERROR)
  }

  return true
})
