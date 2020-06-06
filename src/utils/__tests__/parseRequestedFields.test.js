import { parseRequestedFields } from '../parseRequestedFields'

const ummKeyMappings = {
  concept_id: 'meta.concept-id',
  key_one: 'umm.KeyOne',
  keyTwo: 'umm.KeyTwo'
}

const keyMap = {
  sharedKeys: [
    'concept_id',
    'key_one'
  ],
  ummKeyMappings
}

describe('parseRequestedFields', () => {
  // describe('only json keys requested', () => {
  //   test('returns only json keys', () => {
  //     const requestInfo = {
  //       name: 'tests',
  //       alias: 'tests',
  //       args: {},
  //       fieldsByTypeName: {
  //         TestList: {
  //           items: {
  //             name: 'items',
  //             alias: 'items',
  //             args: {},
  //             fieldsByTypeName: {
  //               Test: {
  //                 conceptId: {
  //                   name: 'conceptId',
  //                   alias: 'conceptId',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 keyThree: {
  //                   name: 'keyThree',
  //                   alias: 'keyThree',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }

  //     const requestedFields = parseRequestedFields(requestInfo, keyMap, 'test')

  //     expect(requestedFields).toEqual({
  //       jsonKeys: ['conceptId', 'keyThree'],
  //       ummKeys: [],
  //       ummKeyMappings,
  //       isList: true
  //     })
  //   })
  // })

  // describe('only umm keys requested', () => {
  //   test('returns only umm keys', () => {
  //     const requestInfo = {
  //       name: 'tests',
  //       alias: 'tests',
  //       args: {},
  //       fieldsByTypeName: {
  //         TestList: {
  //           items: {
  //             name: 'items',
  //             alias: 'items',
  //             args: {},
  //             fieldsByTypeName: {
  //               Test: {
  //                 conceptId: {
  //                   name: 'conceptId',
  //                   alias: 'conceptId',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 keyTwo: {
  //                   name: 'keyTwo',
  //                   alias: 'keyTwo',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }

  //     const requestedFields = parseRequestedFields(requestInfo, keyMap, 'test')

  //     expect(requestedFields).toEqual({
  //       jsonKeys: [],
  //       ummKeys: ['conceptId', 'keyTwo'],
  //       ummKeyMappings,
  //       isList: true
  //     })
  //   })
  // })

  // describe('both json and umm keys requested', () => {
  //   test('returns both json and umm keys optimized for json', () => {
  //     const requestInfo = {
  //       name: 'tests',
  //       alias: 'tests',
  //       args: {},
  //       fieldsByTypeName: {
  //         TestList: {
  //           items: {
  //             name: 'items',
  //             alias: 'items',
  //             args: {},
  //             fieldsByTypeName: {
  //               Test: {
  //                 concept_id: {
  //                   name: 'concept_id',
  //                   alias: 'concept_id',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 key_one: {
  //                   name: 'key_one',
  //                   alias: 'key_one',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 keyTwo: {
  //                   name: 'keyTwo',
  //                   alias: 'keyTwo',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 keyThree: {
  //                   name: 'keyThree',
  //                   alias: 'keyThree',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }

  //     const requestedFields = parseRequestedFields(requestInfo, keyMap, 'test')

  //     expect(requestedFields).toEqual({
  //       jsonKeys: ['conceptId', 'keyOne', 'keyThree'],
  //       ummKeys: ['keyTwo'],
  //       ummKeyMappings,
  //       isList: true
  //     })
  //   })
  // })

  describe('only count', () => {
    test('returns only concept_id', () => {
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
