import { parseRequestedFields } from '../parseRequestedFields'

const ummKeyMappings = {
  conceptId: 'meta.concept-id',
  keyOne: 'umm.KeyOne',
  keyTwo: 'umm.KeyTwo'
}

const keyMap = {
  sharedKeys: [
    'conceptId',
    'keyOne'
  ],
  ummKeyMappings
}

describe('parseRequestedFields', () => {
  describe('only json keys requested', () => {
    test('returns only json keys', () => {
      const requestInfo = {
        name: 'tests',
        alias: 'tests',
        args: {},
        fieldsByTypeName: {
          TestList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Test: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyThree: {
                    name: 'keyThree',
                    alias: 'keyThree',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'test')

      expect(requestedFields).toEqual({
        jsonKeys: ['conceptId', 'keyThree'],
        metaKeys: [],
        ummKeys: [],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('only umm keys requested', () => {
    test('returns only umm keys', () => {
      const requestInfo = {
        name: 'tests',
        alias: 'tests',
        args: {},
        fieldsByTypeName: {
          TestList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Test: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyTwo: {
                    name: 'keyTwo',
                    alias: 'keyTwo',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'test')

      expect(requestedFields).toEqual({
        jsonKeys: [],
        metaKeys: [],
        ummKeys: ['conceptId', 'keyTwo'],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('both json and umm keys requested', () => {
    test('returns both json and umm keys optimized for json', () => {
      const requestInfo = {
        name: 'tests',
        alias: 'tests',
        args: {},
        fieldsByTypeName: {
          TestList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Test: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyOne: {
                    name: 'keyOne',
                    alias: 'keyOne',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyTwo: {
                    name: 'keyTwo',
                    alias: 'keyTwo',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  keyThree: {
                    name: 'keyThree',
                    alias: 'keyThree',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'test')

      expect(requestedFields).toEqual({
        jsonKeys: ['conceptId', 'keyOne', 'keyThree'],
        metaKeys: [],
        ummKeys: ['keyTwo'],
        ummKeyMappings,
        isList: true
      })
    })
  })

  describe('only count', () => {
    test('returns only conceptId', () => {
      const requestInfo = {
        name: 'tests',
        alias: 'tests',
        args: {},
        fieldsByTypeName: {
          TestList: {
            count: {
              name: 'count',
              alias: 'count',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }

      const requestedFields = parseRequestedFields(requestInfo, keyMap, 'test')

      expect(requestedFields).toEqual({
        jsonKeys: ['conceptId'],
        metaKeys: ['testCount'],
        ummKeys: [],
        ummKeyMappings,
        isList: true
      })
    })
  })
})
