import nock from 'nock'

import { parseRequestedFields } from '../../../utils/parseRequestedFields'
import Tool from '../tool'
import toolKeyMap from '../../../utils/umm/toolKeyMap.json'

process.env.cmrRootUrl = 'http://example.com'

describe('Tool concept', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()
  })

  describe('when fetching with params defined', () => {
    test('requests the json with the correct params', async () => {
      nock('http://example.com')
        .post('/search/tools.json')
        .reply(200, { data: 'test' })

      const parsedInfo = {
        name: 'tools',
        alias: 'tools',
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
          ToolList: {
            count: {},
            items: {}
          }
        }
      }

      const requestInfo = parseRequestedFields(parsedInfo, toolKeyMap, 'tool')

      const tool = new Tool({}, requestInfo, {})

      await tool.fetch({
        params: {
          keyword: 'test',
          limit: 5,
          offset: 0,
          provider: null,
          sortKey: null
        },
        pageSize: 5
      })

      const response = await tool.response

      expect(await response[0].config.data).toEqual('provider=&keyword=test&offset=0&page_size=5&sort_key=')
    })
  })
})
