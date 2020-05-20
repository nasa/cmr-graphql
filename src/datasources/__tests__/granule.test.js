import granuleDatasource from '../granule'

import * as parseCmrGranules from '../../utils/parseCmrGranules'
import * as queryCmrGranules from '../../utils/queryCmrGranules'

let requestInfo

describe('granule', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()

    // Default requestInfo an empty
    requestInfo = {
      name: 'granules',
      alias: 'granules',
      args: {},
      fieldsByTypeName: {
        Granule: {
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
    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => [{
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }])

      const parseCmrGranulesMock = jest.spyOn(parseCmrGranules, 'parseCmrGranules')

      const response = await granuleDatasource({}, {}, requestInfo)

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        {},
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrGranulesMock).toBeCalledTimes(1)
      expect(parseCmrGranulesMock).toBeCalledWith({
        data: {
          feed: {
            entry: [{
              concept_id: 'G100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual([{
        concept_id: 'G100000-EDSC'
      }])
    })
  })

  describe('with params', () => {
    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => [{
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }])

      const parseCmrGranulesMock = jest.spyOn(parseCmrGranules, 'parseCmrGranules')

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, {}, requestInfo)

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrGranulesMock).toBeCalledTimes(1)
      expect(parseCmrGranulesMock).toBeCalledWith({
        data: {
          feed: {
            entry: [{
              concept_id: 'G100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual([{
        concept_id: 'G100000-EDSC'
      }])
    })
  })

  describe('with json and umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          Granule: {
            concept_id: {
              name: 'concept_id',
              alias: 'concept_id',
              args: {},
              fieldsByTypeName: {}
            },
            granule_ur: {
              name: 'granule_ur',
              alias: 'granule_ur',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => [{
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }, {
        data: {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        }
      }])

      const parseCmrGranulesMock = jest.spyOn(parseCmrGranules, 'parseCmrGranules')

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, {}, requestInfo)

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: ['concept_id'], ummKeys: ['granule_ur'] })
      )

      expect(parseCmrGranulesMock).toBeCalledTimes(2)
      const [jsonCall, ummCall] = parseCmrGranulesMock.mock.calls
      expect(jsonCall[0]).toEqual({
        data: {
          feed: {
            entry: [{
              concept_id: 'G100000-EDSC'
            }]
          }
        }
      })
      expect(ummCall[0]).toEqual({
        data: {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        }
      })

      expect(response).toEqual([{
        concept_id: 'G100000-EDSC',
        granule_ur: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
      }])
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'granules',
        alias: 'granules',
        args: {},
        fieldsByTypeName: {
          Granule: {
            granule_ur: {
              name: 'granule_ur',
              alias: 'granule_ur',
              args: {},
              fieldsByTypeName: {}
            }
          }
        }
      }
    })

    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => [
        null,
        {
          data: {
            items: [{
              meta: {
                'concept-id': 'G100000-EDSC'
              },
              umm: {
                GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
              }
            }]
          }
        }])

      const parseCmrGranulesMock = jest.spyOn(parseCmrGranules, 'parseCmrGranules')

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, {}, requestInfo)

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        {},
        expect.objectContaining({ jsonKeys: [], ummKeys: ['granule_ur'] })
      )

      expect(parseCmrGranulesMock).toBeCalledTimes(1)
      expect(parseCmrGranulesMock).toBeCalledWith({
        data: {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
            }
          }]
        }
      }, 'umm_json')

      expect(response).toEqual([{
        granule_ur: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
      }])
    })
  })

  test('catches errors received from queryCmrGranules', async () => {
    const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules')
      .mockImplementationOnce(() => new Promise((resolve, reject) => reject(new Error('HTTP Error'))))

    const parseCmrGranulesMock = jest.spyOn(parseCmrGranules, 'parseCmrGranules')

    const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, {}, requestInfo)

    expect(queryCmrGranulesMock).toBeCalledTimes(1)
    expect(queryCmrGranulesMock).toBeCalledWith(
      { concept_id: 'G100000-EDSC' },
      {},
      expect.objectContaining({ jsonKeys: ['concept_id'] })
    )

    expect(parseCmrGranulesMock).toBeCalledTimes(0)

    expect(response).toEqual([])
  })
})
