import { race, shield } from 'graphql-shield'

// We don't have to call this file, simply importing it will call the graphql-shield shield function
// eslint-disable-next-line no-unused-vars
import permissions from '../index'

import { canCreateProviderGroups } from '../acls/canCreateProviderGroups'
import { canCreateSystemGroups } from '../acls/canCreateSystemGroups'
import { canReadGroup } from '../acls/canReadGroup'
import { canReadProviderGroups } from '../acls/canReadProviderGroups'
import { canReadSystemGroups } from '../acls/canReadSystemGroups'

import { isLocalMMT } from '../rules/isLocalMMT'

vi.mock('graphql-shield', async () => {
  const original = await vi.importActual('graphql-shield')

  return {
    ...original,
    shield: vi.fn()
  }
})

describe('permissions', () => {
  test('permissions are correct', () => {
    expect(shield).toHaveBeenCalledTimes(1)
    expect(shield.mock.calls[0][0]).toEqual({
      Query: {
        group: race(
          isLocalMMT,
          canReadGroup
        ),
        groups: race(
          isLocalMMT,
          canReadSystemGroups,
          canReadProviderGroups
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
    })
  })
})
