import { findPreviousRevision } from '../findPreviousRevision'

describe('findPreviousRevision', () => {
  const mockUmmResponse = {
    items: [
      { meta: { 'revision-id': '10' } },
      { meta: { 'revision-id': '9' } },
      { meta: { 'revision-id': '8' } },
      { meta: { 'revision-id': '7' } },
      { meta: { 'revision-id': '6' } },
      { meta: { 'revision-id': '5' } },
      { meta: { 'revision-id': '4' } },
      { meta: { 'revision-id': '3' } },
      { meta: { 'revision-id': '2' } },
      { meta: { 'revision-id': '1' } }
    ]
  }

  describe('when requesting a valid revision', () => {
    test('returns the correct revision', () => {
      const result = findPreviousRevision(mockUmmResponse, '5')
      expect(result).toEqual({ meta: { 'revision-id': '5' } })
    })
  })

  describe('when requesting a revision that is no longer stored', () => {
    test('throws an error', () => {
      expect(() => {
        findPreviousRevision({
          items: [{ meta: { 'revision-id': '20' } }, ...mockUmmResponse.items.slice(0, 9)]
        }, '10')
      }).toThrow('Revision 10 is no longer stored. Please select an available revision from 11 to 20.')
    })
  })
})
