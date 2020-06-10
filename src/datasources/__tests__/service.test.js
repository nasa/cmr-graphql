import nock from 'nock'

import { ApolloError } from 'apollo-server-lambda'

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
        ServiceList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Service: {
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
    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      }])

      const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

      const response = await serviceDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith(
        {},
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId'] })
      )

      expect(parseCmrServicesMock).toBeCalledTimes(1)
      expect(parseCmrServicesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          conceptId: 'S100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      }])

      const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

      const response = await serviceDatasource({ concept_id: 'S100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith(
        { concept_id: 'S100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId'] })
      )

      expect(parseCmrServicesMock).toBeCalledTimes(1)
      expect(parseCmrServicesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'S100000-EDSC'
          }]
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          conceptId: 'S100000-EDSC'
        }]
      })
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
          ServiceList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Service: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
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
          }
        }
      }
    })

    // There are no keys in the json endpoint that are not available
    // in the umm endpoint so services should never make two requests
    // test.skip('returns the parsed service results', async () => {
    //   const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => [{
    //     data: {
    //       items: [{
    //         concept_id: 'S100000-EDSC'
    //       }]
    //     }
    //   }, {
    //     data: {
    //       items: [{
    //         meta: {
    //           'concept-id': 'S100000-EDSC'
    //         },
    //         umm: {
    //           Type: 'OPeNDAP'
    //         }
    //       }]
    //     }
    //   }])

    //   const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

    //   const response = await serviceDatasource({ conceptId: 'S100000-EDSC' }, {}, requestInfo, 'service')

    //   expect(queryCmrServicesMock).toBeCalledTimes(1)
    //   expect(queryCmrServicesMock).toBeCalledWith(
    //     { conceptId: 'S100000-EDSC' },
    //     { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
    //     expect.objectContaining({ jsonKeys: ['conceptId'], ummKeys: ['type'] })
    //   )

    //   expect(parseCmrServicesMock).toBeCalledTimes(2)
    //   const [jsonCall, ummCall] = parseCmrServicesMock.mock.calls
    //   expect(jsonCall[0]).toEqual({
    //     data: {
    //       items: [{
    //         concept_id: 'S100000-EDSC'
    //       }]
    //     }
    //   })
    //   expect(ummCall[0]).toEqual({
    //     data: {
    //       items: [{
    //         meta: {
    //           'concept-id': 'S100000-EDSC'
    //         },
    //         umm: {
    //           Type: 'OPeNDAP'
    //         }
    //       }]
    //     }
    //   })

    //   expect(response).toEqual([{
    //     conceptId: 'S100000-EDSC',
    //     type: 'OPeNDAP'
    //   }])
    // })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'services',
        alias: 'services',
        args: {},
        fieldsByTypeName: {
          ServiceList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Service: {
                  type: {
                    name: 'type',
                    alias: 'type',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  serviceOptions: {
                    name: 'serviceOptions',
                    alias: 'serviceOptions',
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

    test('returns the parsed service results', async () => {
      const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices').mockImplementationOnce(() => [
        null,
        {
          headers: {
            'cmr-hits': 84
          },
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

      const response = await serviceDatasource({ concept_id: 'S100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')

      expect(queryCmrServicesMock).toBeCalledTimes(1)
      expect(queryCmrServicesMock).toBeCalledWith(
        { concept_id: 'S100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: [], ummKeys: ['serviceOptions', 'type'] })
      )

      expect(parseCmrServicesMock).toBeCalledTimes(1)
      expect(parseCmrServicesMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
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

      expect(response).toEqual({
        count: 84,
        items: [{
          type: 'OPeNDAP'
        }]
      })
    })
  })

  test('catches errors received from queryCmrServices', async () => {
    nock(/localhost/)
      .post(/services/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    const queryCmrServicesMock = jest.spyOn(queryCmrServices, 'queryCmrServices')

    const parseCmrServicesMock = jest.spyOn(parseCmrServices, 'parseCmrServices')

    await expect(
      serviceDatasource({ conceptId: 'S100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'service')
    ).rejects.toThrow(ApolloError)


    expect(queryCmrServicesMock).toBeCalledTimes(1)
    expect(queryCmrServicesMock).toBeCalledWith(
      { conceptId: 'S100000-EDSC' },
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      expect.objectContaining({ jsonKeys: ['conceptId'] })
    )

    expect(parseCmrServicesMock).toBeCalledTimes(0)
  })
})
