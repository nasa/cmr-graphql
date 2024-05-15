import {
  createGroup,
  deleteGroup,
  fetchGroup,
  listGroupMembers,
  searchGroup,
  updateGroup
} from '../group'

import * as edlRequest from '../../utils/edlRequest'
import { edlPathTypes } from '../../constants'

describe('group', () => {
  describe('fetchGroup', () => {
    test('returns the user group', async () => {
      const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
        data: {
          mock_data: 'Mock Data'
        }
      })

      const params = {
        id: 'mock-id'
      }
      const context = {
        headers: {}
      }

      const result = await fetchGroup(params, context)

      expect(result).toEqual({
        mockData: 'Mock Data'
      })

      expect(edlRequestMock).toHaveBeenCalledTimes(1)
      expect(edlRequestMock).toHaveBeenCalledWith({
        context,
        method: 'GET',
        params,
        pathType: edlPathTypes.FIND_GROUP
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          id: 'mock-id'
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await fetchGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'GET',
          params,
          pathType: edlPathTypes.FIND_GROUP
        })
      })
    })
  })

  describe('searchGroup', () => {
    describe('when wildcardTags is true', () => {
      test('returns the user groups', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
          data: [{
            group_id: 'mock-group-1',
            tag: 'MMT_2'
          }, {
            group_id: 'mock-group-2',
            tag: 'MMT_1'
          }]
        })

        const params = {
          params: {
            tags: ['MMT'],
            wildcardTags: true
          }
        }
        const context = {
          headers: {}
        }

        const result = await searchGroup(params, context)

        expect(result).toEqual({
          count: 2,
          items: [{
            groupId: 'mock-group-1',
            id: 'mock-group-1',
            tag: 'MMT_2'
          }, {
            groupId: 'mock-group-2',
            id: 'mock-group-2',
            tag: 'MMT_1'
          }]
        })

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'GET',
          params,
          pathType: edlPathTypes.SEARCH_GROUPS
        })
      })
    })

    describe('when wildcardTags is false', () => {
      test('returns the user groups', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
          data: [{
            group_id: 'mock-group-1',
            tag: 'MMT_2'
          }, {
            group_id: 'mock-group-2',
            tag: 'MMT_1'
          }]
        })

        const params = {
          params: {
            tags: ['MMT_2'],
            wildcardTags: false
          }
        }
        const context = {
          headers: {}
        }

        const result = await searchGroup(params, context)

        expect(result).toEqual({
          count: 1,
          items: [{
            groupId: 'mock-group-1',
            id: 'mock-group-1',
            tag: 'MMT_2'
          }]
        })

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'GET',
          params,
          pathType: edlPathTypes.SEARCH_GROUPS
        })
      })
    })

    describe('when wildcardTags is undefined', () => {
      test('returns the user groups', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
          data: [{
            group_id: 'mock-group-1',
            tag: 'MMT_2'
          }, {
            group_id: 'mock-group-2',
            tag: 'MMT_1'
          }]
        })

        const params = {
          params: {
            tags: ['MMT_2']
          }
        }
        const context = {
          headers: {}
        }

        const result = await searchGroup(params, context)

        expect(result).toEqual({
          count: 1,
          items: [{
            groupId: 'mock-group-1',
            id: 'mock-group-1',
            tag: 'MMT_2'
          }]
        })

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'GET',
          params,
          pathType: edlPathTypes.SEARCH_GROUPS
        })
      })
    })

    describe('when there are more than 1 page of results', () => {
      test('returns the user groups limited', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
          data: [{
            group_id: 'mock-group-1',
            tag: 'MMT_2'
          }, {
            group_id: 'mock-group-2',
            tag: 'MMT_2'
          }, {
            group_id: 'mock-group-3',
            tag: 'MMT_2'
          }]
        })

        const params = {
          params: {
            tags: ['MMT_2'],
            limit: 2,
            offset: 0
          }
        }
        const context = {
          headers: {}
        }

        const result = await searchGroup(params, context)

        expect(result).toEqual({
          count: 3,
          items: [{
            groupId: 'mock-group-1',
            id: 'mock-group-1',
            tag: 'MMT_2'
          }, {
            groupId: 'mock-group-2',
            id: 'mock-group-2',
            tag: 'MMT_2'
          }]
        })

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'GET',
          params,
          pathType: edlPathTypes.SEARCH_GROUPS
        })
      })
    })

    describe('when excludeTags is provided', () => {
      test('returns the user groups', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
          data: [{
            group_id: 'mock-group-1',
            tag: 'MMT_2'
          }, {
            group_id: 'mock-group-2',
            tag: 'MMT_2'
          }, {
            group_id: 'mock-group-3',
            tag: 'MMT_1'
          }]
        })

        const params = {
          params: {
            excludeTags: ['MMT_1']
          }
        }
        const context = {
          headers: {}
        }

        const result = await searchGroup(params, context)

        expect(result).toEqual({
          count: 2,
          items: [{
            groupId: 'mock-group-1',
            id: 'mock-group-1',
            tag: 'MMT_2'
          }, {
            groupId: 'mock-group-2',
            id: 'mock-group-2',
            tag: 'MMT_2'
          }]
        })

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'GET',
          params,
          pathType: edlPathTypes.SEARCH_GROUPS
        })
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          tags: ['MMT_2']
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await searchGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'GET',
          params,
          pathType: edlPathTypes.SEARCH_GROUPS
        })
      })
    })
  })

  describe('listGroupMembers', () => {
    test('returns the user groups', async () => {
      const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
        data: {
          users: [{
            mock_data: 'Mock Data'
          }]
        }
      })

      const params = {
        tags: ['MMT_2']
      }
      const context = {
        headers: {}
      }

      const result = await listGroupMembers(params, context)

      expect(result).toEqual({
        count: 1,
        items: [{
          mockData: 'Mock Data'
        }]
      })

      expect(edlRequestMock).toHaveBeenCalledTimes(1)
      expect(edlRequestMock).toHaveBeenCalledWith({
        context,
        method: 'GET',
        params,
        pathType: edlPathTypes.FIND_MEMBERS
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          tags: ['MMT_2']
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await listGroupMembers(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'GET',
          params,
          pathType: edlPathTypes.FIND_MEMBERS
        })
      })
    })
  })

  describe('createGroup', () => {
    test('returns the user groups', async () => {
      const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
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

      const result = await createGroup(params, context)

      expect(result).toEqual({
        mockData: 'Mock Data'
      })

      expect(edlRequestMock).toHaveBeenCalledTimes(1)
      expect(edlRequestMock).toHaveBeenCalledWith({
        context,
        method: 'POST',
        params,
        pathType: edlPathTypes.CREATE_GROUP
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          tags: ['MMT_2']
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await createGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'POST',
          params,
          pathType: edlPathTypes.CREATE_GROUP
        })
      })
    })
  })

  describe('deleteGroup', () => {
    test('returns the user groups', async () => {
      const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockResolvedValue({
        status: 200
      })

      const params = {
        id: 'mock-id'
      }
      const context = {
        headers: {}
      }

      const result = await deleteGroup(params, context)

      expect(result).toEqual(true)

      expect(edlRequestMock).toHaveBeenCalledTimes(1)
      expect(edlRequestMock).toHaveBeenCalledWith({
        context,
        method: 'DELETE',
        params,
        pathType: edlPathTypes.DELETE_GROUP
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          id: 'mock-id'
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await deleteGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'DELETE',
          params,
          pathType: edlPathTypes.DELETE_GROUP
        })
      })
    })
  })

  describe('updateGroup', () => {
    test('returns the user groups', async () => {
      const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest')
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
        id: 'mock-id',
        description: 'Updated Description',
        tag: 'NEW_TAG'
      }
      const context = {
        headers: {}
      }

      const result = await updateGroup(params, context)

      expect(result).toEqual({
        mockData: 'Mock Data',
        description: 'Updated Description'
      })

      expect(edlRequestMock).toHaveBeenCalledTimes(2)
      expect(edlRequestMock).toHaveBeenCalledWith({
        context,
        method: 'POST',
        params: {
          ...params,
          newTag: 'NEW_TAG',
          tag: undefined
        },
        pathType: edlPathTypes.UPDATE_GROUP
      })

      expect(edlRequestMock).toHaveBeenCalledWith({
        context,
        method: 'GET',
        params,
        pathType: edlPathTypes.FIND_GROUP
      })
    })

    describe('when the request errors', () => {
      test('calls parseError', async () => {
        const edlRequestMock = vi.spyOn(edlRequest, 'edlRequest').mockImplementation(async () => {
          throw new Error('Mock Error')
        })

        const params = {
          id: 'mock-id',
          description: 'Updated Description'
        }
        const context = {
          headers: {}
        }

        await expect(async () => {
          await updateGroup(params, context)
        }).rejects.toThrowError('Mock Error')

        expect(edlRequestMock).toHaveBeenCalledTimes(1)
        expect(edlRequestMock).toHaveBeenCalledWith({
          context,
          method: 'POST',
          params,
          pathType: edlPathTypes.UPDATE_GROUP
        })
      })
    })
  })
})
