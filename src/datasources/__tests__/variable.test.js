import variableDatasource from '../variable'

import * as variableParser from '../../parsers/variable'
import * as queryCmrVariables from '../../utils/queryCmrVariables'

describe('variable', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()
  })

  describe('without params', () => {
    test('returns the parsed variable results', async () => {
      const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables').mockImplementationOnce(() => Promise.resolve({
        data: {
          items: [{
            id: 'V100000-EDSC'
          }]
        }
      }))

      const variableParserMock = jest.spyOn(variableParser, 'default')

      const response = await variableDatasource({}, {})

      expect(queryCmrVariablesMock).toBeCalledTimes(1)
      expect(queryCmrVariablesMock).toBeCalledWith({}, {})

      expect(variableParserMock).toBeCalledTimes(1)
      expect(variableParserMock).toBeCalledWith({
        data: {
          items: [{
            id: 'V100000-EDSC'
          }]
        }
      })

      expect(response).toEqual([{
        id: 'V100000-EDSC'
      }])
    })
  })

  describe('with params', () => {
    test('returns the parsed variable results', async () => {
      const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables').mockImplementationOnce(() => Promise.resolve({
        data: {
          items: [{
            id: 'V100000-EDSC'
          }]
        }
      }))

      const variableParserMock = jest.spyOn(variableParser, 'default')

      const response = await variableDatasource({ concept_id: 'V100000-EDSC' }, {})

      expect(queryCmrVariablesMock).toBeCalledTimes(1)
      expect(queryCmrVariablesMock).toBeCalledWith({ concept_id: 'V100000-EDSC' }, {})

      expect(variableParserMock).toBeCalledTimes(1)
      expect(variableParserMock).toBeCalledWith({
        data: {
          items: [{
            id: 'V100000-EDSC'
          }]
        }
      })

      expect(response).toEqual([{
        id: 'V100000-EDSC'
      }])
    })
  })

  test('catches errors received from queryCmrVariables', async () => {
    const queryCmrVariablesMock = jest.spyOn(queryCmrVariables, 'queryCmrVariables').mockImplementationOnce(() => {
      throw new Error('HTTP Error')
    })

    const variableParserMock = jest.spyOn(variableParser, 'default')

    const response = await variableDatasource({ concept_id: 'V100000-EDSC' }, {})

    expect(queryCmrVariablesMock).toBeCalledTimes(1)
    expect(queryCmrVariablesMock).toBeCalledWith({ concept_id: 'V100000-EDSC' }, {})

    expect(variableParserMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
