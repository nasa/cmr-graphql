import serviceDatasource from '../service'

import * as parseCmrServices from '../../utils/parseCmrServices'
import * as queryCmrServices from '../../utils/queryCmrServices'

let requestInfo

describe('service', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()

    // Default requestInfo an empty
    requestInfo = {
      name: 'services',
      alias: 'services',
      args: {},
      fieldsByTypeName: {
        Service: {
          concept_id: {
            name: 'concept_id',
            alias: 'concept_id',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }
  })

  describe('without params', () => {
    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => [{
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      }])


      const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

      const response = await serviceDatasource({}, {}, requestInfo)

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith(
        {},
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrServicesMock).toBeCalledTimes(1)
      expect(parseCmrServicesMock).toBeCalledWith({
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      })

      expect(response).toEqual([{
        concept_id: 'S100000-EDSC'
      }])
    })
  })

  describe('with params', () => {
    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => [{
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      }])

      const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

      const response = await serviceDatasource({ concept_id: 'S100000-EDSC' }, {}, requestInfo)

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith(
        { concept_id: 'S100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrServicesMock).toBeCalledTimes(1)
      expect(parseCmrServicesMock).toBeCalledWith({
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      })

      expect(response).toEqual([{
        concept_id: 'S100000-EDSC'
      }])
    })
  })

  describe('with json and umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'services',
        alias: 'services',
        args: {},
        fieldsByTypeName: {
          Service: {
            concept_id: {
              name: 'concept_id',
              alias: 'concept_id',
              args: {},
              fieldsByTypeName: {}
            },
            type: {
              name: 'type',
              alias: 'type',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => [{
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      }, {
        data: {
          items: [{
            meta: {
              'concept-id': 'S100000-EDSC'
            },
            umm: {
              Type: 'OPeNDAP'
            }
          }]
        }
      }])

      const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

      const response = await serviceDatasource({ concept_id: 'S100000-EDSC' }, {}, requestInfo)

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith(
        { concept_id: 'S100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'], ummKeys: ['type'] })
      )

      expect(parseCmrServicesMock).toBeCalledTimes(2)
      const [jsonCall, ummCall] = parseCmrServicesMock.mock.calls
      expect(jsonCall[0]).toEqual({
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      })
      expect(ummCall[0]).toEqual({
        data: {
          items: [{
            meta: {
              'concept-id': 'S100000-EDSC'
            },
            umm: {
              Type: 'OPeNDAP'
            }
          }]
        }
      })

      expect(response).toEqual([{
        concept_id: 'S100000-EDSC',
        type: 'OPeNDAP'
      }])
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'services',
        alias: 'services',
        args: {},
        fieldsByTypeName: {
          Service: {
            type: {
              name: 'type',
              alias: 'type',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => [
        null,
        {
          data: {
            items: [{
              meta: {
                'concept-id': 'S100000-EDSC'
              },
              umm: {
                Type: 'OPeNDAP'
              }
            }]
          }
        }])

      const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

      const response = await serviceDatasource({ concept_id: 'S100000-EDSC' }, {}, requestInfo)

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith(
        { concept_id: 'S100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: [], ummKeys: ['type'] })
      )

      expect(parseCmrServicesMock).toBeCalledTimes(1)
      expect(parseCmrServicesMock).toBeCalledWith({
        data: {
          items: [{
            meta: {
              'concept-id': 'S100000-EDSC'
            },
            umm: {
              Type: 'OPeNDAP'
            }
          }]
        }
      })

      expect(response).toEqual([{
        type: 'OPeNDAP'
      }])
    })
  })

  test('catches errors received from queryCmrServices', async () => {
    const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices')
      .mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error('HTTP Error'))))

    const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

    const response = await serviceDatasource({ concept_id: 'S100000-EDSC' }, {}, requestInfo)

    expect(queryCmrServicesMock).toBeCalledTimes(1)
    expect(queryCmrServicesMock).toBeCalledWith(
      { concept_id: 'S100000-EDSC' },
      {},
      expect.objectContaining({ jsonKeys: ['concept_id'] })
    )

    expect(parseCmrServicesMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
