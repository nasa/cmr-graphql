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
  //                 concept_id: {
  //                   name: 'concept_id',
  //                   alias: 'concept_id',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 key_three: {
  //                   name: 'key_three',
  //                   alias: 'key_three',
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
  //       jsonKeys: ['concept_id', 'key_three'],
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
  //                 concept_id: {
  //                   name: 'concept_id',
  //                   alias: 'concept_id',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 key_two: {
  //                   name: 'key_two',
  //                   alias: 'key_two',
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
  //       ummKeys: ['concept_id', 'key_two'],
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
  //                 key_two: {
  //                   name: 'key_two',
  //                   alias: 'key_two',
  //                   args: {},
  //                   fieldsByTypeName: {}
  //                 },
  //                 key_three: {
  //                   name: 'key_three',
  //                   alias: 'key_three',
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
  //       jsonKeys: ['concept_id', 'key_one', 'key_three'],
  //       ummKeys: ['key_two'],
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
        jsonKeys: ['concept_id'],
        metaKeys: ['test_count'],
        ummKeys: [],
        ummKeyMappings,
        isList: true
      })
    })
  })
})
