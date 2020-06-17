import { handlePagingParams } from '../handlePagingParams'

describe('handlePagingParams', () => {
  describe('when no page size is provided', () => {
    test('the default value is returned in the payload', () => {
      const response = handlePagingParams({
        param: 'value'
      })

      expect(response).toEqual({
        param: 'value',
        pageSize: 20
      })
    })
  })

  describe('when page size is provided', () => {
    test('the provided page size is returned in the payload', () => {
      const response = handlePagingParams({
        limit: 5,
        param: 'value'
      })

      expect(response).toEqual({
        param: 'value',
        pageSize: 5
      })
    })
  })
})
