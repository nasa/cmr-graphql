import { canCreateSystemGroups } from '../canCreateSystemGroups'

import * as hasPermission from '../../../utils/hasPermission'
import { forbiddenError } from '../../../utils/forbiddenError'

describe('canCreateSystemGroups', () => {
  test('returns true if the user has permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

    const result = await canCreateSystemGroups.resolve(
      null,
      {},
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(true)
  })

  test('throws a ForbiddenError if the user does not have permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

    const result = await canCreateSystemGroups.resolve(
      null,
      {
        tag: 'CMR'
      },
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [create] on system object [GROUP]'))
  })

  test('returns true if the tag is CMR and the user has system permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

    const result = await canCreateSystemGroups.resolve(
      null,
      {
        tag: 'CMR'
      },
      {
        edlUsername: 'test-user'
      }
    )
    expect(result).toEqual(true)
  })
})
