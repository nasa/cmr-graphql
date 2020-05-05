import serviceDatasource from '../service'

import * as serviceParser from '../../utils/parseCmrServices'
import * as queryCmrServices from '../../utils/queryCmrServices'

describe('service', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()
  })

  describe('without params', () => {
    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => Promise.resolve({
        data: {
          items: [{
            id: 'S100000-EDSC'
          }]
        }
      }))

      const serviceParserMock = jest.spyOn(serviceParser, 'parseCmrServices')

      const response = await serviceDatasource({}, {})

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith({}, {})

      expect(serviceParserMock).toBeCalledTimes(1)
      expect(serviceParserMock).toBeCalledWith({
        data: {
          items: [{
            id: 'S100000-EDSC'
          }]
        }
      })

      expect(response).toEqual([{
        id: 'S100000-EDSC'
      }])
    })
  })

  describe('with params', () => {
    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => Promise.resolve({
        data: {
          items: [{
            id: 'S100000-EDSC'
          }]
        }
      }))

      const serviceParserMock = jest.spyOn(serviceParser, 'parseCmrServices')

      const response = await serviceDatasource({ concept_id: 'S100000-EDSC' }, {})

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith({ concept_id: 'S100000-EDSC' }, {})

      expect(serviceParserMock).toBeCalledTimes(1)
      expect(serviceParserMock).toBeCalledWith({
        data: {
          items: [{
            id: 'S100000-EDSC'
          }]
        }
      })

      expect(response).toEqual([{
        id: 'S100000-EDSC'
      }])
    })
  })

  test('catches errors received from queryCmrServices', async () => {
    const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => {
      throw new Error('HTTP Error')
    })

    const serviceParserMock = jest.spyOn(serviceParser, 'parseCmrServices')

    const response = await serviceDatasource({ concept_id: 'S100000-EDSC' }, {})

    expect(queryCmrServicesMock).toBeCalledTimes(1)
    expect(queryCmrServicesMock).toBeCalledWith({ concept_id: 'S100000-EDSC' }, {})

    expect(serviceParserMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
