import { canReadGroup } from '../canReadGroup'

import * as hasPermission from '../../../utils/hasPermission'
import { forbiddenError } from '../../../utils/forbiddenError'

vi.mock('graphql-parse-resolve-info')
vi.mock('../../../utils/parseRequestedFields')

describe('canReadGroup', () => {
  describe('when the group is a CMR group', () => {
    test('returns true if the user has permission', async () => {
      const hasPermissionMock = vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

      const result = await canReadGroup.resolve(
        null,
        {
          params: {
            id: '1234-abcd-5678'
          }
        },
        {
          dataSources: {
            groupSourceFetch: vi.fn().mockResolvedValue({ tag: 'CMR' })
          },
          edlUsername: 'test-user'
        },
        {}
      )

      expect(result).toEqual(true)

      expect(hasPermissionMock).toHaveBeenCalledTimes(1)
      expect(hasPermissionMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          permissions: 'read',
          permissionOptions: {
            user_id: 'test-user',
            system_object: 'GROUP'
          }
        }
      )
    })

    test('throws a ForbiddenError if the user does not have permission', async () => {
      const hasPermissionMock = vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

      const result = await canReadGroup.resolve(
        null,
        {
          params: {
            id: '1234-abcd-5678'
          }
        },
        {
          dataSources: {
            groupSourceFetch: vi.fn().mockResolvedValue({ tag: 'CMR' })
          },
          edlUsername: 'test-user'
        }
      )

      expect(result).toEqual(forbiddenError('Not authorized to perform [read] on system object [GROUP]'))

      expect(hasPermissionMock).toHaveBeenCalledTimes(1)
      expect(hasPermissionMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          permissions: 'read',
          permissionOptions: {
            user_id: 'test-user',
            system_object: 'GROUP'
          }
        }
      )
    })
  })

  describe('when the group is a provider group', () => {
    test('returns true if the user has permission', async () => {
      const hasPermissionMock = vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(true)

      const result = await canReadGroup.resolve(
        null,
        {
          params: {
            id: '1234-abcd-5678'
          }
        },
        {
          dataSources: {
            groupSourceFetch: vi.fn().mockResolvedValue({ tag: 'GQL' })
          },
          edlUsername: 'test-user'
        },
        {}
      )

      expect(result).toEqual(true)

      expect(hasPermissionMock).toHaveBeenCalledTimes(1)
      expect(hasPermissionMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          permissions: 'read',
          permissionOptions: {
            provider: 'GQL',
            target: 'GROUP',
            user_id: 'test-user'
          }
        }
      )
    })

    test('throws a ForbiddenError if the user does not have permission', async () => {
      const hasPermissionMock = vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

      const result = await canReadGroup.resolve(
        null,
        {
          params: {
            id: '1234-abcd-5678'
          }
        },
        {
          dataSources: {
            groupSourceFetch: vi.fn().mockResolvedValue({ tag: 'GQL' })
          },
          edlUsername: 'test-user'
        }
      )

      expect(result).toEqual(forbiddenError('Not authorized to perform [read] on provider object [GROUP]'))

      expect(hasPermissionMock).toHaveBeenCalledTimes(1)
      expect(hasPermissionMock).toHaveBeenCalledWith(
        expect.any(Object),
        {
          permissions: 'read',
          permissionOptions: {
            provider: 'GQL',
            target: 'GROUP',
            user_id: 'test-user'
          }
        }
      )
    })
  })

  test('throws a ForbiddenError if the user does not exist', async () => {
    vi.spyOn(hasPermission, 'hasPermission').mockResolvedValue(false)

    const result = await canReadGroup.resolve(
      null,
      {
        params: {
          id: '1234-abcd-5678'
        }
      },
      {
        edlUsername: null
      }
    )

    expect(result).toEqual(forbiddenError('Not authorized to perform [read] on system object [GROUP]'))
  })
})
