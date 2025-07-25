import { canReadProviderGroups } from '../canReadProviderGroups'

import * as hasPermission from '../../../utils/hasPermission'
import { forbiddenError } from '../../../utils/forbiddenError'

describe('canReadProviderGroups', () => {
  test('returns true if the user has permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

    const result = await canReadProviderGroups.resolve(
      null,
      {
        params: {
          tags: ['GQL']
        }
      },
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(true)
  })

  test('returns true if the user has permission for all tags', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

    const result = await canReadProviderGroups.resolve(
      null,
      {
        params: {
          tags: ['GQL', 'TEST']
        }
      },
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(true)
  })

  test('throws a ForbiddenError if the user does not have permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

    const result = await canReadProviderGroups.resolve(
      null,
      {
        params: {
          tags: ['GQL']
        }
      },
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [read] on provider object [GROUP]'))
  })

  test('throws a ForbiddenError if the user does not have permission for all tags', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValueOnce(true)
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValueOnce(false)

    const result = await canReadProviderGroups.resolve(
      null,
      {
        params: {
          tags: ['GQL', 'TEST']
        }
      },
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [read] on provider object [GROUP]'))
  })

  test('throws a ForbiddenError if the user does not exist', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

    const result = await canReadProviderGroups.resolve(
      null,
      {
        params: {
          tags: ['GQL']
        }
      },
      {
        edlUsername: null
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [read] on provider object [GROUP]'))
  })

  test('returns true if no tags are provided', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

    const result = await canReadProviderGroups.resolve(
      null,
      {},
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(true)
  })
})
