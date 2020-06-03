import nock from 'nock'

import { ApolloError } from 'apollo-server-lambda'

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
        GranuleList: {
          items: {
            name: 'items',
            alias: 'items',
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
        }
      }
    }
  })

  describe('without params', () => {
    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }])

      const parseCmrGranulesMock = jest.spyOn(parseCmrGranules, 'parseCmrGranules')

      const response = await granuleDatasource({}, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        {},
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrGranulesMock).toBeCalledTimes(1)
      expect(parseCmrGranulesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              concept_id: 'G100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          concept_id: 'G100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        }
      }])

      const parseCmrGranulesMock = jest.spyOn(parseCmrGranules, 'parseCmrGranules')

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['concept_id'] })
      )

      expect(parseCmrGranulesMock).toBeCalledTimes(1)
      expect(parseCmrGranulesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              concept_id: 'G100000-EDSC'
            }]
          }
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          concept_id: 'G100000-EDSC'
        }]
      })
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
          GranuleList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  concept_id: {
                    name: 'concept_id',
                    alias: 'concept_id',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  browse_flag: {
                    name: 'browse_flag',
                    alias: 'browse_flag',
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
          }
        }
      }
    })

    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC',
              browse_flag: true
            }]
          }
        }
      }, {
        headers: {
          'cmr-hits': 84
        },
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

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['browse_flag', 'concept_id'], ummKeys: ['granule_ur'] })
      )

      expect(parseCmrGranulesMock).toBeCalledTimes(2)
      const [jsonCall, ummCall] = parseCmrGranulesMock.mock.calls
      expect(jsonCall[0]).toEqual({
        headers: {
          'cmr-hits': 84
        },
        data: {
          feed: {
            entry: [{
              concept_id: 'G100000-EDSC',
              browse_flag: true
            }]
          }
        }
      })
      expect(ummCall[0]).toEqual({
        headers: {
          'cmr-hits': 84
        },
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

      expect(response).toEqual({
        count: 84,
        items: [{
          concept_id: 'G100000-EDSC',
          browse_flag: true,
          granule_ur: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
        }]
      })
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
          GranuleList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Granule: {
                  granule_ur: {
                    name: 'granule_ur',
                    alias: 'granule_ur',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  temporal_extent: {
                    name: 'temporal_extent',
                    alias: 'temporal_extent',
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

    test('returns the parsed granule results', async () => {
      const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules').mockImplementationOnce(() => [
        null,
        {
          headers: {
            'cmr-hits': 84
          },
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

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: [], ummKeys: ['granule_ur', 'temporal_extent'] })
      )

      expect(parseCmrGranulesMock).toBeCalledTimes(1)
      expect(parseCmrGranulesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
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

      expect(response).toEqual({
        count: 84,
        items: [{
          granule_ur: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
        }]
      })
    })
  })

  test('catches errors received from queryCmrGranules', async () => {
    nock(/localhost/)
      .post(/granules/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    const queryCmrGranulesMock = jest.spyOn(queryCmrGranules, 'queryCmrGranules')

    const parseCmrGranulesMock = jest.spyOn(parseCmrGranules, 'parseCmrGranules')

    await expect(
      granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-ID': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')
    ).rejects.toThrow(ApolloError)

    expect(queryCmrGranulesMock).toBeCalledTimes(1)
    expect(queryCmrGranulesMock).toBeCalledWith(
      { concept_id: 'G100000-EDSC' },
      { 'CMR-Request-ID': 'abcd-1234-efgh-5678' },
      expect.objectContaining({ jsonKeys: ['concept_id'] })
    )

    expect(parseCmrGranulesMock).toBeCalledTimes(0)
  })
})
