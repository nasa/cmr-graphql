import { canCreateProviderGroups } from '../canCreateProviderGroups'

import * as hasPermission from '../../../utils/hasPermission'
import { forbiddenError } from '../../../utils/forbiddenError'

describe('canCreateProviderGroups', () => {
  test('when a tag is provided and the user has access to provider permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

    const result = await canCreateProviderGroups.resolve(
      null,
      {
        tag: 'MOCK-PROVIDER'
      },
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(true)
  })

  test('throws a ForbiddenError if the user does not have permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

    const result = await canCreateProviderGroups.resolve(
      null,
      {
        tag: 'MOCK-PROVIDER'
      },
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [create] on provider object [GROUP]'))
  })

  test('when a tag is not provided and the user does not have permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

    const result = await canCreateProviderGroups.resolve(
      null,
      {
        tag: 'CMR'
      },
      {
        edlUsername: 'test-user'
      }
    )
    expect(result).toEqual(false)
  })
})
