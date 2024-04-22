import {
  createUserGroup,
  deleteUserGroup,
  fetchUserGroup,
  searchUserGroup,
  updateUserGroup
} from '../userGroup'

import * as userGroupsRequest from '../../utils/userGroupsRequest'

describe('userGroup', () => {
  describe('fetchUserGroup', () => {
    test('returns the user group', async () => {
      const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockResolvedValue({
        data: {
          mock_data: 'Mock Data'
        }
      })

      const params = {
        userGroupIdOrName: 'mock-id'
      }
      const context = {
        headers: {}
      }

      const result = await fetchUserGroup(params, context)

      expect(result).toEqual({
        mockData: 'Mock Data'
      })

      expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
      expect(userGroupsRequestMock).toHaveBeenCalledWith({
        headers: {},
        method: 'GET',
        params
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          userGroupIdOrName: 'mock-id'
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await fetchUserGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
        expect(userGroupsRequestMock).toHaveBeenCalledWith({
          headers: {},
          method: 'GET',
          params
        })
      })
    })
  })

  describe('searchUserGroup', () => {
    test('returns the user groups', async () => {
      const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockResolvedValue({
        data: [{
          mock_data: 'Mock Data'
        }]
      })

      const params = {
        tags: ['MMT_2']
      }
      const context = {
        headers: {}
      }

      const result = await searchUserGroup(params, context)

      expect(result).toEqual({
        count: 1,
        items: [{
          mockData: 'Mock Data'
        }]
      })

      expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
      expect(userGroupsRequestMock).toHaveBeenCalledWith({
        headers: {},
        method: 'GET',
        params
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          tags: ['MMT_2']
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await searchUserGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
        expect(userGroupsRequestMock).toHaveBeenCalledWith({
          headers: {},
          method: 'GET',
          params
        })
      })
    })
  })

  describe('createUserGroup', () => {
    test('returns the user groups', async () => {
      const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockResolvedValue({
        data: {
          mock_data: 'Mock Data'
        }
      })

      const params = {
        tags: ['MMT_2']
      }
      const context = {
        headers: {}
      }

      const result = await createUserGroup(params, context)

      expect(result).toEqual({
        mockData: 'Mock Data'
      })

      expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
      expect(userGroupsRequestMock).toHaveBeenCalledWith({
        headers: {},
        method: 'POST',
        params
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          tags: ['MMT_2']
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await createUserGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
        expect(userGroupsRequestMock).toHaveBeenCalledWith({
          headers: {},
          method: 'POST',
          params
        })
      })
    })
  })

  describe('deleteUserGroup', () => {
    test('returns the user groups', async () => {
      const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockResolvedValue({
        status: 200
      })

      const params = {
        id: 'mock-id'
      }
      const context = {
        headers: {}
      }

      const result = await deleteUserGroup(params, context)

      expect(result).toEqual(true)

      expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
      expect(userGroupsRequestMock).toHaveBeenCalledWith({
        headers: {},
        method: 'DELETE',
        params
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          id: 'mock-id'
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await deleteUserGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
        expect(userGroupsRequestMock).toHaveBeenCalledWith({
          headers: {},
          method: 'DELETE',
          params
        })
      })
    })
  })

  describe('updateUserGroup', () => {
    test('returns the user groups', async () => {
      const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest')
        .mockResolvedValueOnce({
          status: 200
        })
        .mockResolvedValueOnce({
          data: {
            mock_data: 'Mock Data',
            description: 'Updated Description'
          }
        })

      const params = {
        userGroupIdOrName: 'mock-id',
        description: 'Updated Description'
      }
      const context = {
        headers: {}
      }

      const result = await updateUserGroup(params, context)

      expect(result).toEqual({
        mockData: 'Mock Data',
        description: 'Updated Description'
      })

      expect(userGroupsRequestMock).toHaveBeenCalledTimes(2)
      expect(userGroupsRequestMock).toHaveBeenCalledWith({
        headers: {},
        method: 'POST',
        params
      })

      expect(userGroupsRequestMock).toHaveBeenCalledWith({
        headers: {},
        method: 'GET',
        params
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const userGroupsRequestMock = vi.spyOn(userGroupsRequest, 'userGroupsRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          userGroupIdOrName: 'mock-id',
          description: 'Updated Description'
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await updateUserGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(userGroupsRequestMock).toHaveBeenCalledTimes(1)
        expect(userGroupsRequestMock).toHaveBeenCalledWith({
          headers: {},
          method: 'POST',
          params
        })
      })
    })
  })
})
