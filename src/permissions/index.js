import {
  allow,
  race,
  shield
} from 'graphql-shield'

import { canReadSystemGroups } from './acls/canReadSystemGroups'
import { canCreateSystemGroups } from './acls/canCreateSystemGroups'

import { isLocalMMT } from './rules/isLocalMMT'
import { canCreateProviderGroups } from './acls/canCreateProviderGroups'

const permissions = shield(
  {
    Query: {
      // The `race` rule allows you to chain the rules so that execution stops once one of them returns.
      // So if the `isLocalMMT` rule passes, don't bother checking the permissions of the user
      group: race(
        isLocalMMT,
        canReadSystemGroups
      ),
      groups: race(
        isLocalMMT,
        canReadSystemGroups
      )
    },
    Mutation: {
      createGroup: race(
        isLocalMMT,
        canCreateProviderGroups,
        canCreateSystemGroups,
      ),
      deleteGroup: race(
        isLocalMMT,
        canCreateSystemGroups
      ),
      updateGroup: race(
        isLocalMMT,
        canCreateProviderGroups,
        canCreateSystemGroups,
      )
    }
  },
  {
    fallbackRule: allow,

    // Only allow the external errors when running in the local DEV environment
    allowExternalErrors: process.env.IS_OFFLINE,

    // `fallbackError` displays a useful message to the user containing a requestId, rather than the default "Not Authorized!" GraphQL Shield error.
    fallbackError: async (thrownThing, parent, args, context) => {
      const { requestId } = context

      throw new Error(`An unknown error occurred. Please refer to the ID ${requestId} when contacting Earthdata Operations (support@earthdata.nasa.gov).`)
    }
  }
)

export default permissions
