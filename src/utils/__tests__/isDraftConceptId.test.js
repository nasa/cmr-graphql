import { isDraftConceptId } from '../isDraftConceptId'

describe('isDraftConceptId', () => {
  describe('when the concept id is a draft collection', () => {
    test('returns true', () => {
      expect(isDraftConceptId('CD100000-EDSC', 'collection')).toEqual(true)
    })
  })

  describe('when the concept id is a published collection', () => {
    test('returns false', () => {
      expect(isDraftConceptId('C100000-EDSC', 'collection')).toEqual(false)
    })
  })

  describe('when the concept id is a draft service', () => {
    test('returns true', () => {
      expect(isDraftConceptId('SD100000-EDSC', 'service')).toEqual(true)
    })
  })

  describe('when the concept id is a published service', () => {
    test('returns false', () => {
      expect(isDraftConceptId('S100000-EDSC', 'service')).toEqual(false)
    })
  })

  describe('when the concept id is a draft tool', () => {
    test('returns true', () => {
      expect(isDraftConceptId('TD100000-EDSC', 'tool')).toEqual(true)
    })
  })

  describe('when the concept id is a published tool', () => {
    test('returns false', () => {
      expect(isDraftConceptId('T100000-EDSC', 'tool')).toEqual(false)
    })
  })

  describe('when the concept id is a draft variable', () => {
    test('returns true', () => {
      expect(isDraftConceptId('VD100000-EDSC', 'variable')).toEqual(true)
    })
  })

  describe('when the concept id is a published variable', () => {
    test('returns false', () => {
      expect(isDraftConceptId('V100000-EDSC', 'variable')).toEqual(false)
    })
  })
})
