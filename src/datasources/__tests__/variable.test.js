import variableDatasource from '../variable'

import * as parseCmrVariables from '../../utils/parseCmrVariables'
import * as queryCmrVariables from '../../utils/queryCmrVariables'

let requestInfo

describe('variable', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()

    // Default requestInfo an empty
    requestInfo = {
      name: 'variables',
      alias: 'variables',
      args: {},
      fieldsByTypeName: {
        VariableList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Variable: {
                concept_id: {
                  name: 'concept_id',
                  alias: 'concept_id',
                  args: {},
                  fieldsByTypeName: {}
                }
              }
            }
          }
        }
      }
    }
  })

  describe('without params', () => {
    test('returns the parsed variable results', async () => {
      const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'V100000-EDSC'
          }]
        }
      }])

      const parseCmrVariablesMock = jest.spyOn(parseCmrVariables, 'parseCmrVariables')

      const response = await variableDatasource({}, {}, requestInfo, 'variable')

      expect(queryCmrVariablesMock).toBeCalledTimes(1)
      expect(queryCmrVariablesMock).toBeCalledWith(
        {},
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrVariablesMock).toBeCalledTimes(1)
      expect(parseCmrVariablesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'V100000-EDSC'
          }]
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          concept_id: 'V100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed variable results', async () => {
      const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'V100000-EDSC'
          }]
        }
      }])

      const parseCmrVariablesMock = jest.spyOn(parseCmrVariables, 'parseCmrVariables')

      const response = await variableDatasource({ concept_id: 'V100000-EDSC' }, {}, requestInfo, 'variable')

      expect(queryCmrVariablesMock).toBeCalledTimes(1)
      expect(queryCmrVariablesMock).toBeCalledWith(
        { concept_id: 'V100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrVariablesMock).toBeCalledTimes(1)
      expect(parseCmrVariablesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'V100000-EDSC'
          }]
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          concept_id: 'V100000-EDSC'
        }]
      })
    })
  })

  describe('with json and umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'variables',
        alias: 'variables',
        args: {},
        fieldsByTypeName: {
          VariableList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Variable: {
                  concept_id: {
                    name: 'concept_id',
                    alias: 'concept_id',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  variable_type: {
                    name: 'variable_type',
                    alias: 'variable_type',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    // There are no keys in the json endpoint that are not available
    // in the umm endpoint so services should never make two requests
    // test.skip('returns the parsed variable results', async () => {
    //   const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables').mockImplementationOnce(() => [{
    //     data: {
    //       items: [{
    //         concept_id: 'V100000-EDSC'
    //       }]
    //     }
    //   }, {
    //     data: {
    //       items: [{
    //         meta: {
    //           'concept-id': 'V100000-EDSC'
    //         },
    //         umm: {
    //           VariableType: 'SCIENCE_VARIABLE'
    //         }
    //       }]
    //     }
    //   }])

    //   const parseCmrVariablesMock = jest.spyOn(parseCmrVariables, 'parseCmrVariables')

    //   const response = await variableDatasource({ concept_id: 'V100000-EDSC' }, {}, requestInfo, 'variable')

    //   expect(queryCmrVariablesMock).toBeCalledTimes(1)
    //   expect(queryCmrVariablesMock).toBeCalledWith(
    //     { concept_id: 'V100000-EDSC' },
    //     {},
    //     expect.objectContaining({ jsonKeys: ['concept_id'], ummKeys: ['variable_type'] })
    //   )

    //   expect(parseCmrVariablesMock).toBeCalledTimes(2)
    //   const [jsonCall, ummCall] = parseCmrVariablesMock.mock.calls
    //   expect(jsonCall[0]).toEqual({
    //     data: {
    //       items: [{
    //         concept_id: 'V100000-EDSC'
    //       }]
    //     }
    //   })
    //   expect(ummCall[0]).toEqual({
    //     data: {
    //       items: [{
    //         meta: {
    //           'concept-id': 'V100000-EDSC'
    //         },
    //         umm: {
    //           VariableType: 'SCIENCE_VARIABLE'
    //         }
    //       }]
    //     }
    //   })

    //   expect(response).toEqual([{
    //     concept_id: 'V100000-EDSC',
    //     variable_type: 'SCIENCE_VARIABLE'
    //   }])
    // })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'variables',
        alias: 'variables',
        args: {},
        fieldsByTypeName: {
          VariableList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Variable: {
                  variable_type: {
                    name: 'variable_type',
                    alias: 'variable_type',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  science_keywords: {
                    name: 'science_keywords',
                    alias: 'science_keywords',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns the parsed variable results', async () => {
      const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables').mockImplementationOnce(() => [
        null,
        {
          headers: {
            'cmr-hits': 84
          },
          data: {
            items: [{
              meta: {
                'concept-id': 'V100000-EDSC'
              },
              umm: {
                VariableType: 'SCIENCE_VARIABLE'
              }
            }]
          }
        }])

      const parseCmrVariablesMock = jest.spyOn(parseCmrVariables, 'parseCmrVariables')

      const response = await variableDatasource({ concept_id: 'V100000-EDSC' }, {}, requestInfo, 'variable')

      expect(queryCmrVariablesMock).toBeCalledTimes(1)
      expect(queryCmrVariablesMock).toBeCalledWith(
        { concept_id: 'V100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: [], ummKeys: ['science_keywords', 'variable_type'] })
      )

      expect(parseCmrVariablesMock).toBeCalledTimes(1)
      expect(parseCmrVariablesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            meta: {
              'concept-id': 'V100000-EDSC'
            },
            umm: {
              VariableType: 'SCIENCE_VARIABLE'
            }
          }]
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          variable_type: 'SCIENCE_VARIABLE'
        }]
      })
    })
  })

  test('catches errors received from queryCmrVariables', async () => {
    const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables')
      .mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error('HTTP Error'))))

    const parseCmrVariablesMock = jest.spyOn(parseCmrVariables, 'parseCmrVariables')

    const response = await variableDatasource({ concept_id: 'V100000-EDSC' }, {}, requestInfo, 'variable')

    expect(queryCmrVariablesMock).toBeCalledTimes(1)
    expect(queryCmrVariablesMock).toBeCalledWith(
      { concept_id: 'V100000-EDSC' },
      {},
      expect.objectContaining({ jsonKeys: ['concept_id'] })
    )

    expect(parseCmrVariablesMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
