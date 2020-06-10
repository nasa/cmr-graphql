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

      const response = await granuleDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        {},
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId'] })
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
          conceptId: 'G100000-EDSC'
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

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId'] })
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
          conceptId: 'G100000-EDSC'
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
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  browseFlag: {
                    name: 'browseFlag',
                    alias: 'browseFlag',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  granuleUr: {
                    name: 'granuleUr',
                    alias: 'granuleUr',
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

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['browseFlag', 'conceptId'], ummKeys: ['granuleUr'] })
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
          conceptId: 'G100000-EDSC',
          browseFlag: true,
          granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
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
                  granuleUr: {
                    name: 'granuleUr',
                    alias: 'granuleUr',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  temporalExtent: {
                    name: 'temporalExtent',
                    alias: 'temporalExtent',
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

      const response = await granuleDatasource({ concept_id: 'G100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')

      expect(queryCmrGranulesMock).toBeCalledTimes(1)
      expect(queryCmrGranulesMock).toBeCalledWith(
        { concept_id: 'G100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: [], ummKeys: ['granuleUr', 'temporalExtent'] })
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
          granuleUr: 'GLDAS_CLSM025_D.2.0:GLDAS_CLSM025_D.A19480101.020.nc4'
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
      granuleDatasource({ conceptId: 'G100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'granule')
    ).rejects.toThrow(ApolloError)

    expect(queryCmrGranulesMock).toBeCalledTimes(1)
    expect(queryCmrGranulesMock).toBeCalledWith(
      { conceptId: 'G100000-EDSC' },
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      expect.objectContaining({ jsonKeys: ['conceptId'] })
    )

    expect(parseCmrGranulesMock).toBeCalledTimes(0)
  })
})
