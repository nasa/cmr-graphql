import nock from 'nock'

import { ApolloError } from 'apollo-server-lambda'

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
                conceptId: {
                  name: 'conceptId',
                  alias: 'conceptId',
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

      const response = await variableDatasource({}, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')

      expect(queryCmrVariablesMock).toBeCalledTimes(1)
      expect(queryCmrVariablesMock).toBeCalledWith(
        {},
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId'] })
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
          conceptId: 'V100000-EDSC'
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

      const response = await variableDatasource({ concept_id: 'V100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')

      expect(queryCmrVariablesMock).toBeCalledTimes(1)
      expect(queryCmrVariablesMock).toBeCalledWith(
        { concept_id: 'V100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId'] })
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
          conceptId: 'V100000-EDSC'
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
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  variableType: {
                    name: 'variableType',
                    alias: 'variableType',
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
    //     { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
    //     expect.objectContaining({ jsonKeys: ['conceptId'], ummKeys: ['variableType'] })
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
    //     conceptId: 'V100000-EDSC',
    //     variableType: 'SCIENCE_VARIABLE'
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
                  variableType: {
                    name: 'variableType',
                    alias: 'variableType',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  scienceKeywords: {
                    name: 'scienceKeywords',
                    alias: 'scienceKeywords',
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

      const response = await variableDatasource({ conceptId: 'V100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')

      expect(queryCmrVariablesMock).toBeCalledTimes(1)
      expect(queryCmrVariablesMock).toBeCalledWith(
        { conceptId: 'V100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: [], ummKeys: ['scienceKeywords', 'variableType'] })
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
          variableType: 'SCIENCE_VARIABLE'
        }]
      })
    })
  })

  test('catches errors received from queryCmrVariables', async () => {
    nock(/localhost/)
      .post(/variables/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables')

    const parseCmrVariablesMock = jest.spyOn(parseCmrVariables, 'parseCmrVariables')

    await expect(
      variableDatasource({ conceptId: 'V100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'variable')
    ).rejects.toThrow(ApolloError)

    expect(queryCmrVariablesMock).toBeCalledTimes(1)
    expect(queryCmrVariablesMock).toBeCalledWith(
      { conceptId: 'V100000-EDSC' },
      { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
      expect.objectContaining({ jsonKeys: ['conceptId'] })
    )

    expect(parseCmrVariablesMock).toBeCalledTimes(0)
  })
})
