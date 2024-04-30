import { hasPermission } from '../hasPermission'
import * as fetchPermissions from '../fetchPermissions'

vi.mock('../fetchPermissions')

describe('hasPermission', () => {
  describe('when checking permissions', () => {
    describe('if no options are provided', () => {
      test('should return false', async () => {
        const result = await hasPermission()

        expect(result).toEqual(false)
      })
    })

    describe('if no permissions are provided', () => {
      test('should return false', async () => {
        const result = await hasPermission({
          permissionOptions: {
            userId: 'testUrsId',
            provider: 'PROVIDER',
            target: 'TARGET'
          }
        })

        expect(result).toEqual(false)
      })
    })

    describe('if no permissionOptions are provided', () => {
      test('should return false', async () => {
        const result = await hasPermission({
          permissions: 'read'
        })

        expect(result).toEqual(false)
      })
    })

    describe('when the fetchPermissions call fails', () => {
      test('returns false', async () => {
        fetchPermissions.fetchPermissions.mockResolvedValue(false)

        const mockContext = {
          clientId: 'mock-client-id',
          requestId: 'mock-request-id'
        }

        const result = await hasPermission(
          mockContext,
          {
            permissions: 'read',
            permissionOptions: {
              provider: 'PROVIDER',
              target: 'TARGET'
            }
          }
        )

        expect(result).toEqual(false)

        expect(fetchPermissions.fetchPermissions).toHaveBeenCalledTimes(1)
        expect(fetchPermissions.fetchPermissions).toHaveBeenCalledWith(
          {
            provider: 'PROVIDER',
            target: 'TARGET'
          },
          mockContext
        )
      })
    })

    describe('when checking a single permission', () => {
      describe('when the user has the permission', () => {
        test('returns true', async () => {
          fetchPermissions.fetchPermissions.mockResolvedValue({ TARGET: ['read'] })

          const mockContext = {
            clientId: 'mock-client-id',
            requestId: 'mock-request-id'
          }

          const result = await hasPermission(
            mockContext,
            {
              permissions: 'read',
              permissionOptions: {
                system_object: 'GROUP',
                user_id: 'test-user'
              }
            }
          )

          expect(result).toEqual(true)
        })
      })

      describe('when the user has no permissions', () => {
        test('returns false', async () => {
          fetchPermissions.fetchPermissions.mockResolvedValue({ TARGET: [] })

          const mockContext = {
            clientId: 'mock-client-id',
            requestId: 'mock-request-id'
          }

          const result = await hasPermission(
            mockContext,
            {
              permissions: 'read',
              permissionOptions: {
                system_object: 'GROUP',
                user_id: 'test-user'
              }
            }
          )

          expect(result).toEqual(false)
        })
      })

      describe('when the user has incorrect permissions', () => {
        test('returns false', async () => {
          fetchPermissions.fetchPermissions.mockResolvedValue({ TARGET: ['update', 'delete'] })

          const mockContext = {
            clientId: 'mock-client-id',
            requestId: 'mock-request-id'
          }

          const result = await hasPermission(
            mockContext,
            {
              permissions: 'read',
              permissionOptions: {
                system_object: 'GROUP',
                user_id: 'test-user'
              }
            }
          )

          expect(result).toEqual(false)
        })
      })
    })

    describe('when checking multiple permissions', () => {
      describe('when the user has all permissions', () => {
        test('returns true', async () => {
          fetchPermissions.fetchPermissions.mockResolvedValue({ TARGET: ['read', 'update', 'delete'] })

          const mockContext = {
            clientId: 'mock-client-id',
            requestId: 'mock-request-id'
          }

          const result = await hasPermission(
            mockContext,
            {
              permissions: ['read', 'update'],
              permissionOptions: {
                system_object: 'GROUP',
                user_id: 'test-user'
              }
            }
          )

          expect(result).toEqual(true)
        })
      })

      describe('when the user has no permissions', () => {
        test('returns false', async () => {
          fetchPermissions.fetchPermissions.mockResolvedValue({ TARGET: [] })

          const mockContext = {
            clientId: 'mock-client-id',
            requestId: 'mock-request-id'
          }

          const result = await hasPermission(
            mockContext,
            {
              permissions: ['read', 'update'],
              permissionOptions: {
                system_object: 'GROUP',
                user_id: 'test-user'
              }
            }
          )

          expect(result).toEqual(false)
        })
      })

      describe('when the user has only one permission', () => {
        test('returns false', async () => {
          fetchPermissions.fetchPermissions.mockResolvedValue({ TARGET: ['read'] })

          const mockContext = {
            clientId: 'mock-client-id',
            requestId: 'mock-request-id'
          }

          const result = await hasPermission(
            mockContext,
            {
              permissions: ['read', 'update'],
              permissionOptions: {
                system_object: 'GROUP',
                user_id: 'test-user'
              }
            }
          )

          expect(result).toEqual(false)
        })
      })

      describe('when returning target ids', () => {
        test('returns returns the target ids mapped with correct values', async () => {
          fetchPermissions.fetchPermissions.mockResolvedValue({
            'G-1234': ['read'],
            'G-5678': ['update']
          })

          const mockContext = {
            clientId: 'mock-client-id',
            requestId: 'mock-request-id'
          }

          const result = await hasPermission(
            mockContext,
            {
              permissions: 'read',
              permissionOptions: {
                concept_id: ['G-1234', 'G-5678wa']
              },
              returnTargetIds: true
            }
          )

          expect(result).toEqual({
            'G-1234': true,
            'G-5678': false
          })
        })
      })
    })
  })
})
