import nock from 'nock'

import { parseRequestedFields } from '../../../utils/parseRequestedFields'
import Provider from '../provider'
import providerKeyMap from '../../../utils/umm/providerKeyMap.json'

process.env.cmrRootUrl = 'http://example.com'

describe('Provider concept', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()
  })

  describe('when fetching', () => {
    test('requests the json', async () => {
      nock('http://example.com')
        .get('/ingest/providers')
        .reply(200, { data: 'test' })

      const parsedInfo = {
        name: 'provider',
        alias: 'providers',
        args: {},
        fieldsByTypeName: {
          ProviderList: {
            count: {},
            items: {}
          }
        }
      }

      const requestInfo = parseRequestedFields(parsedInfo, providerKeyMap, 'provider')

      const provider = new Provider({}, requestInfo, {})

      await provider.fetch({
        params: {
          keyword: 'test',
          limit: 5,
          offset: 0,
          provider: null,
          sortKey: null
        },
        pageSize: 5
      })

      const response = await provider.response

      expect(await response[0].config.data).toEqual(undefined)
      expect(await response[0].config.url).toEqual('http://example.com/ingest/providers')
    })
  })
})
