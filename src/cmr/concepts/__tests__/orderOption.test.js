import nock from 'nock'

import { v4 } from 'uuid'
import orderOptionKeyMap from '../../../utils/umm/orderOptionKeyMap.json'
import { parseRequestedFields } from '../../../utils/parseRequestedFields'
import OrderOption from '../orderOption'

process.env.cmrRootUrl = 'http://example.com'
process.env.ummOrderOptionVersion = '1.0.0'

vi.mock('uuid', () => ({
  v4: vi.fn()
}))

describe('OrderOption concept', () => {
  afterEach(() => {
    vi.clearAllMocks()
    vi.resetAllMocks()
  })

  describe('when fetching without params defined', () => {
    test('requests the json with the default params', async () => {
      nock('http://example.com')
        .post('/search/order-options.json')
        .reply(200, {
          hits: 1,
          took: 100,
          items: [
            {
              concept_id: 'OO12341234_TEST',
              revision_id: 1,
              provider_id: 'TEST',
              native_id: 'test-native-id',
              name: 'This is a test name'
            }
          ]
        })

      const parsedInfo = {
        name: 'order-options',
        alias: 'order-options',
        args: {},
        fieldsByTypeName: {
          OrderOptionList: {
            count: {},
            items: {}
          }
        }
      }

      const requestInfo = parseRequestedFields(parsedInfo, orderOptionKeyMap, 'orderOption')

      const orderOption = new OrderOption({}, requestInfo)

      await orderOption.fetch()

      const response = await orderOption.response

      expect(await response[0].config.url).toEqual('http://example.com/search/order-options.json')
      expect(await response[0].config.data).toEqual('')
    })
  })

  describe('when fetching with params defined', () => {
    test('requests the json with the params', async () => {
      nock('http://example.com')
        .post('/search/order-options.json')
        .reply(200, {
          hits: 1,
          took: 100,
          items: [
            {
              concept_id: 'OO12341234_TEST',
              revision_id: 1,
              provider_id: 'TEST',
              native_id: 'test-native-id',
              name: 'This is a test name'
            }
          ]
        })

      const parsedInfo = {
        name: 'order-options',
        alias: 'order-options',
        args: {
          params: {
            conceptId: 'OO12341234_TEST'
          }
        },
        fieldsByTypeName: {
          OrderOptionList: {
            count: {},
            items: {}
          }
        }
      }

      const requestInfo = parseRequestedFields(parsedInfo, orderOptionKeyMap, 'orderOption')

      const orderOption = new OrderOption({}, requestInfo)

      await orderOption.fetch({
        params: { conceptId: 'OO12341234_TEST' }
      })

      const response = await orderOption.response
      console.log('🚀 ~ test ~ response:', response)

      expect(await response[0].config.url).toEqual('http://example.com/search/order-options.json')
      expect(await response[0].config.data).toEqual('concept_id=OO12341234_TEST')
    })
  })

  test('sets the metadataSpecification correctly', () => {
    const orderOption = new OrderOption({}, {}, {
      conceptId: 'OO12341234_TEST'
    })

    expect(orderOption.metadataSpecification).toEqual({
      Name: 'Order Option',
      URL: 'https://cdn.earthdata.nasa.gov/generics/order-option/v1.0.0',
      Version: '1.0.0'
    })
  })

  describe('when calling ingest', () => {
    test('sends a request to the correct endpoint', async () => {
      nock('http://example.com')
        .put('/ingest/providers/TEST/order-options/test-native-id')
        .reply(200, {
          'concept-id': 'OO1200481598-MMT_1',
          'revision-id': 1
        })

      const orderOption = new OrderOption({}, {}, {
        conceptId: 'OO12341234_TEST'
      })

      const params = {
        name: 'Test name',
        description: 'Test description',
        nativeId: 'test-native-id',
        providerId: 'TEST',
        form: 'This is a form'
      }

      const requestedKeys = ['conceptId', 'revisionId']

      await orderOption.ingest(params, requestedKeys, {})

      const response = await orderOption.response

      expect(await response.config.url).toEqual('http://example.com/ingest/providers/TEST/order-options/test-native-id')
    })

    test('sends a request with the correct data', async () => {
      nock('http://example.com')
        .put('/ingest/providers/TEST/order-options/test-native-id')
        .reply(200, {
          'concept-id': 'OO1200481598-MMT_1',
          'revision-id': 1
        })

      const orderOption = new OrderOption({}, {}, {
        conceptId: 'OO12341234_TEST'
      })

      const params = {
        name: 'Test name',
        description: 'Test description',
        nativeId: 'test-native-id',
        providerId: 'TEST',
        form: 'This is a form'
      }

      const requestedKeys = ['conceptId', 'revisionId']

      await orderOption.ingest(params, requestedKeys, {})

      const response = await orderOption.response

      const responseData = {
        Name: 'Test name',
        Description: 'Test description',
        Form: 'This is a form',
        MetadataSpecification: {
          URL: 'https://cdn.earthdata.nasa.gov/generics/order-option/v1.0.0',
          Name: 'Order Option',
          Version: '1.0.0'
        }
      }

      expect(await response.config.data).toEqual(JSON.stringify(responseData))
    })

    describe('when a native id is not provided', () => {
      test('generates a native id for the request', async () => {
        v4.mockReturnValue('generated-native-id')

        nock('http://example.com')
          .put('/ingest/providers/TEST/order-options/generated-native-id')
          .reply(200, {
            'concept-id': 'OO1200481598-MMT_1',
            'revision-id': 1
          })

        const orderOption = new OrderOption({}, {}, {
          conceptId: 'OO12341234_TEST'
        })

        const params = {
          name: 'Test name',
          description: 'Test description',
          providerId: 'TEST',
          form: 'This is a form'
        }

        const requestedKeys = ['conceptId', 'revisionId']

        await orderOption.ingest(params, requestedKeys, {})

        const response = await orderOption.response

        const responseData = {
          Name: 'Test name',
          Description: 'Test description',
          Form: 'This is a form',
          MetadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/generics/order-option/v1.0.0',
            Name: 'Order Option',
            Version: '1.0.0'
          }
        }

        expect(await response.config.data).toEqual(JSON.stringify(responseData))
      })
    })
  })

  describe('when parsing the json response', () => {
    test('returns the items', () => {
      const orderOption = new OrderOption({}, {}, {
        conceptId: 'OO12341234_TEST'
      })

      const jsonBody = {
        data: {
          items: [
            {
              test: 'test'
            }
          ]
        }
      }

      const items = orderOption.parseJsonBody(jsonBody)

      expect(items).toEqual([{ test: 'test' }])
    })
  })

  describe('when fetching umm json', () => {
    test('returns the request', async () => {
      nock('http://example.com')
        .post('/search/order-options.umm_json')
        .reply(200, {
          hits: 1,
          took: 100,
          items: [
            {
              meta: {
                'revision-id': 1,
                deleted: false,
                'provider-id': 'TEST',
                'user-id': 'test',
                'native-id': 'test-native-id',
                'concept-id': 'OO12341234_TEST',
                'revision-date': '2024-04-12T17:07:15.534Z',
                'concept-type': 'order-option'
              },
              umm: {
                Description: 'This is a test description',
                Form: 'This is a test form',
                Name: 'This is a test name',
                MetadataSpecification: {
                  URL: 'https://cdn.earthdata.nasa.gov/generics/order-option/v1.0.0',
                  Name: 'Order Option',
                  Version: '1.0.0'
                }
              }
            }
          ]
        })

      const orderOption = new OrderOption({}, {}, {
        conceptId: 'OO12341234_TEST'
      })

      const searchParams = { conceptId: 'OO12341234-TEST' }
      const ummKeys = ['conceptId', 'description', 'nativeId']

      const ummResponse = await orderOption.fetchUmm(searchParams, ummKeys, {})

      expect(ummResponse.config.url).toEqual('http://example.com/search/order-options.umm_json')
      expect(ummResponse.config.data).toEqual('concept_id=OO12341234-TEST')
    })
  })
})
