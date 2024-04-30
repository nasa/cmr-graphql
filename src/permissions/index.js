import { allow, shield } from 'graphql-shield'

import { canReadSystemGroups } from './acls/canReadSystemGroups'
import { canCreateSystemGroups } from './acls/canCreateSystemGroups'

const permissions = shield(
  {
    Query: {
      group: canReadSystemGroups,
      groups: canReadSystemGroups
    },
    Mutation: {
      createGroup: canCreateSystemGroups,
      deleteGroup: canCreateSystemGroups,
      updateGroup: canCreateSystemGroups
    }
  },
  {
    fallbackRule: allow,

    // Only allow the external errors (like Prisma errors) when running in the local DEV environment
    allowExternalErrors: process.env.IS_OFFLINE,

    // `fallbackError` displays a useful message to the user containing a requestId, rather than the default "Not Authorized!" GraphQL Shield error.
    fallbackError: async (thrownThing, parent, args, context) => {
      const { requestId } = context

      throw new Error(`An unknown error occurred. Please refer to the ID ${requestId} when contacting Earthdata Operations (support@earthdata.nasa.gov).`)
    }
  }
)

export default permissions
