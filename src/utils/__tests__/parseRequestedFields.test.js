import { parseRequestedFields } from '../parseRequestedFields'

const ummKeyMappings = {
  concept_id: 'meta.concept-id',
  key_one: 'umm.KeyOne',
  key_two: 'umm.KeyTwo'
}

const keyMap = {
  sharedKeys: [
    'concept_id',
    'key_one'
  ],
  ummKeyMappings
}

describe('parseRequestedFields', () => {
  describe('only json keys requested', () => {
    test('returns only json keys', () => {
      const requestedFields = parseRequestedFields(['concept_id', 'key_three'], keyMap)

      expect(requestedFields).toEqual({
        jsonKeys: ['concept_id', 'key_three'],
        ummKeys: [],
        ummKeyMappings
      })
    })
  })

  describe('only umm keys requested', () => {
    test('returns only umm keys', () => {
      const requestedFields = parseRequestedFields(['concept_id', 'key_two'], keyMap)

      expect(requestedFields).toEqual({
        jsonKeys: [],
        ummKeys: ['concept_id', 'key_two'],
        ummKeyMappings
      })
    })
  })

  describe('both json and umm keys requested', () => {
    test('returns both json and umm keys optimized for json', () => {
      const requestedFields = parseRequestedFields(['concept_id', 'key_one', 'key_two', 'key_three'], keyMap)

      expect(requestedFields).toEqual({
        jsonKeys: ['concept_id', 'key_one', 'key_three'],
        ummKeys: ['key_two'],
        ummKeyMappings
      })
    })
  })
})
