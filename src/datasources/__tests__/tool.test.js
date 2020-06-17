import nock from 'nock'

import { ApolloError } from 'apollo-server-lambda'

import toolDatasource from '../tool'

import * as parseCmrTools from '../../utils/parseCmrTools'
import * as queryCmrTools from '../../utils/queryCmrTools'

let requestInfo

describe('tool', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    // Resets the parser mock
    jest.restoreAllMocks()

    // Default requestInfo an empty
    requestInfo = {
      name: 'tools',
      alias: 'tools',
      args: {},
      fieldsByTypeName: {
        ToolList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Tool: {
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
    test('returns the parsed tool results', async () => {
      const queryCmrToolsMock = jest.spyOn(queryCmrTools, 'queryCmrTools').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        }
      }])

      const parseCmrToolsMock = jest.spyOn(parseCmrTools, 'parseCmrTools')

      const response = await toolDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

      expect(queryCmrToolsMock).toBeCalledTimes(1)
      expect(queryCmrToolsMock).toBeCalledWith(
        {},
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId'] })
      )

      expect(parseCmrToolsMock).toBeCalledTimes(1)
      expect(parseCmrToolsMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          conceptId: 'T100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed tool results', async () => {
      const queryCmrToolsMock = jest.spyOn(queryCmrTools, 'queryCmrTools').mockImplementationOnce(() => [{
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        }
      }])

      const parseCmrToolsMock = jest.spyOn(parseCmrTools, 'parseCmrTools')

      const response = await toolDatasource({ concept_id: 'T100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

      expect(queryCmrToolsMock).toBeCalledTimes(1)
      expect(queryCmrToolsMock).toBeCalledWith(
        { concept_id: 'T100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: ['conceptId'] })
      )

      expect(parseCmrToolsMock).toBeCalledTimes(1)
      expect(parseCmrToolsMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        }
      })

      expect(response).toEqual({
        count: 84,
        items: [{
          conceptId: 'T100000-EDSC'
        }]
      })
    })
  })

  describe('with json and umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'tools',
        alias: 'tools',
        args: {},
        fieldsByTypeName: {
          ToolList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Tool: {
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
    // in the umm endpoint so tools should never make two requests
    // test.skip('returns the parsed tool results', async () => {
    //   const queryCmrToolsMock = jest.spyOn(queryCmrTools, 'queryCmrTools').mockImplementationOnce(() => [{
    //     data: {
    //       items: [{
    //         concept_id: 'T100000-EDSC'
    //       }]
    //     }
    //   }, {
    //     data: {
    //       items: [{
    //         meta: {
    //           'concept-id': 'T100000-EDSC'
    //         },
    //         umm: {
    //           Type: 'OPeNDAP'
    //         }
    //       }]
    //     }
    //   }])

    //   const parseCmrToolsMock = jest.spyOn(parseCmrTools, 'parseCmrTools')

    //   const response = await toolDatasource({ conceptId: 'T100000-EDSC' }, {}, requestInfo, 'tool')

    //   expect(queryCmrToolsMock).toBeCalledTimes(1)
    //   expect(queryCmrToolsMock).toBeCalledWith(
    //     { conceptId: 'T100000-EDSC' },
    //     { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
    //     expect.objectContaining({ jsonKeys: ['conceptId'], ummKeys: ['type'] })
    //   )

    //   expect(parseCmrToolsMock).toBeCalledTimes(2)
    //   const [jsonCall, ummCall] = parseCmrToolsMock.mock.calls
    //   expect(jsonCall[0]).toEqual({
    //     data: {
    //       items: [{
    //         concept_id: 'T100000-EDSC'
    //       }]
    //     }
    //   })
    //   expect(ummCall[0]).toEqual({
    //     data: {
    //       items: [{
    //         meta: {
    //           'concept-id': 'T100000-EDSC'
    //         },
    //         umm: {
    //           Type: 'OPeNDAP'
    //         }
    //       }]
    //     }
    //   })

    //   expect(response).toEqual([{
    //     conceptId: 'T100000-EDSC',
    //     type: 'OPeNDAP'
    //   }])
    // })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'tools',
        alias: 'tools',
        args: {},
        fieldsByTypeName: {
          ToolList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Tool: {
                  type: {
                    name: 'type',
                    alias: 'type',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  toolKeywords: {
                    name: 'toolKeywords',
                    alias: 'toolKeywords',
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

    test('returns the parsed tool results', async () => {
      const queryCmrToolsMock = jest.spyOn(queryCmrTools, 'queryCmrTools').mockImplementationOnce(() => [
        null,
        {
          headers: {
            'cmr-hits': 84
          },
          data: {
            items: [{
              meta: {
                'concept-id': 'T100000-EDSC'
              },
              umm: {
                Type: 'OPeNDAP'
              }
            }]
          }
        }])

      const parseCmrToolsMock = jest.spyOn(parseCmrTools, 'parseCmrTools')

      const response = await toolDatasource({ concept_id: 'T100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')

      expect(queryCmrToolsMock).toBeCalledTimes(1)
      expect(queryCmrToolsMock).toBeCalledWith(
        { concept_id: 'T100000-EDSC' },
        { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
        expect.objectContaining({ jsonKeys: [], ummKeys: ['toolKeywords', 'type'] })
      )

      expect(parseCmrToolsMock).toBeCalledTimes(1)
      expect(parseCmrToolsMock).toBeCalledWith({
        headers: {
          'cmr-hits': 84
        },
        data: {
          items: [{
            meta: {
              'concept-id': 'T100000-EDSC'
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

  test('catches errors received from queryCmrTools', async () => {
    nock(/localhost/)
      .post(/tools/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    const queryCmrToolsMock = jest.spyOn(queryCmrTools, 'queryCmrTools')

    const parseCmrToolsMock = jest.spyOn(parseCmrTools, 'parseCmrTools')

    await expect(
      toolDatasource({ conceptId: 'T100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'tool')
    ).rejects.toThrow(ApolloError)


    expect(queryCmrToolsMock).toBeCalledTimes(1)
    expect(queryCmrToolsMock).toBeCalledWith(
      { conceptId: 'T100000-EDSC' },
      { 'CMR-Request-Id': 'abcd-1234-efgh-5678' },
      expect.objectContaining({ jsonKeys: ['conceptId'] })
    )

    expect(parseCmrToolsMock).toBeCalledTimes(0)
  })
})
