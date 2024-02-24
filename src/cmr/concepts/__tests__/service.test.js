import nock from 'nock'

import { parseRequestedFields } from '../../../utils/parseRequestedFields'
import Service from '../service'
import serviceKeyMap from '../../../utils/umm/serviceKeyMap.json'

process.env.cmrRootUrl = 'http://example.com'

describe('Service concept', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()
  })

  describe('Service concept', () => {
    describe('retrieve the parent collection', () => {
      describe('if a parent collection is passed into the service', () => {
        test('Ensure that the parentCollectionConceptId can be passed to child queries', () => {
          const service = new Service({}, {}, {}, 'C1234567889')
          service.associationDetails = {}
          const items = { meta: { 'association-details': {} } }
          service.setEssentialUmmValues('S1234', items)
          expect(service.parentCollectionConceptId).toEqual('C1234567889')
        })
      })
    })
  })

  describe('when fetching with params defined', () => {
    test('requests the json with the correct params', async () => {
      nock('http://example.com')
        .post('/search/services.json')
        .reply(200, { data: 'test' })

      const parsedInfo = {
        name: 'services',
        alias: 'services',
        args: {
          params: {
            keyword: 'test',
            limit: 25,
            offset: 0,
            provider: null,
            sortKey: null
          }
        },
        fieldsByTypeName: {
          ServiceList: {
            count: {},
            items: {}
          }
        }
      }

      const requestInfo = parseRequestedFields(parsedInfo, serviceKeyMap, 'service')

      const service = new Service({}, requestInfo, {}, 'C1234567889')

      await service.fetch({
        params: {
          keyword: 'test',
          limit: 5,
          offset: 0,
          provider: null,
          sortKey: null
        },
        pageSize: 5
      })

      const response = await service.response

      expect(await response[0].config.data).toEqual('keyword=test&provider=&offset=0&page_size=5&sort_key=')
    })
  })
})
