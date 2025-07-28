import { canReadSystemGroups } from '../canReadSystemGroups'

import * as hasPermission from '../../../utils/hasPermission'
import { forbiddenError } from '../../../utils/forbiddenError'

describe('canReadSystemGroups', () => {
  test('returns true if the user has permission', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

    const result = await canReadSystemGroups.resolve(
      null,
      {
        params: {
          tags: ['CMR']
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

    const result = await canReadSystemGroups.resolve(
      null,
      {
        params: {
          tags: ['CMR']
        }
      },
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [read] on system object [GROUP]'))
  })

  test('throws a ForbiddenError if the user does not exist', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

    const result = await canReadSystemGroups.resolve(
      null,
      {
        params: {
          tags: ['CMR']
        }
      },
      {
        edlUsername: null
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [read] on system object [GROUP]'))
  })

  test('throws a ForbiddenError if no tags are provided', async () => {
    const result = await canReadSystemGroups.resolve(
      null,
      {},
      {
        edlUsername: 'test-user'
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [read] on system object [GROUP]'))
  })
})
