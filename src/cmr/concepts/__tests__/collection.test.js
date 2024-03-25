import nock from 'nock'

import { parseRequestedFields } from '../../../utils/parseRequestedFields'
import Collection from '../collection'
import collectionKeyMap from '../../../utils/umm/collectionKeyMap.json'

process.env.cmrRootUrl = 'http://example.com'

describe('Collection concept', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()
  })

  describe('when fetching with params defined', () => {
    test('requests the json with the correct params', async () => {
      nock('http://example.com')
        .post('/search/collections.json')
        .reply(200, { data: 'test' })

      const parsedInfo = {
        name: 'collections',
        alias: 'collections',
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
          CollectionList: {
            count: {},
            items: {}
          }
        }
      }

      const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

      const collection = new Collection({}, requestInfo, {})

      await collection.fetch({
        params: {
          keyword: 'test',
          limit: 5,
          offset: 0,
          provider: null,
          sortKey: null
        },
        pageSize: 5
      })

      const response = await collection.response

      expect(await response[0].config.data).toEqual('keyword=test&offset=0&page_size=5&sort_key=&provider=')
    })
  })
})
