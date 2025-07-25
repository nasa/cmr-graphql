import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { rule } from 'graphql-shield'

import { hasPermission } from '../../utils/hasPermission'
import { forbiddenError } from '../../utils/forbiddenError'
import { parseRequestedFields } from '../../utils/parseRequestedFields'

const ERROR = 'Not authorized to perform [read] on system object [GROUP]'

/**
 * Check to see if the user can read the requested group. Fetches the group from EDL
 * to determine the tag (provider) for the group, then uses hasPermission to check
 * permissions in CMR.
 * @method
 * @return {(true|ForbiddenError)}
 */
export const canReadGroup = rule()(async (parent, params, context, info) => {
  const { dataSources, edlUsername } = context
  if (!edlUsername) {
    return forbiddenError(ERROR)
  }

  // Fetch group, so that we can pull out the tag to check permissions against
  const resolvedInfo = parseResolveInfo(info)
  const requestInfo = parseRequestedFields(resolvedInfo, {}, 'group')
  const group = await dataSources.groupSourceFetch(
    params,
    context,
    requestInfo
  )
  const { tag } = group

  // If the tag is CMR (SYSTEM) check if the user has access to read system groups
  if (tag === 'CMR') {
    if (
      await hasPermission(
        context,
        {
          permissions: 'read',
          permissionOptions: {
            user_id: edlUsername,
            system_object: 'GROUP'
          }
        }
      )
    ) return true

    return forbiddenError('Not authorized to perform [read] on system object [GROUP]')
  }

  // Else, check provider group permission with tag value
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

  return forbiddenError('Not authorized to perform [read] on provider object [GROUP]')
})
