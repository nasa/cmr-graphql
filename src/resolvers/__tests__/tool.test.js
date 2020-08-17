import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'
import { createTestClient } from 'apollo-server-testing'

import resolvers from '..'
import typeDefs from '../../types'

import collectionSource from '../../datasources/collection'
import granuleSource from '../../datasources/granule'
import serviceSource from '../../datasources/service'
import toolSource from '../../datasources/tool'
import variableSource from '../../datasources/variable'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'CMR-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    collectionSource,
    granuleSource,
    serviceSource,
    toolSource,
    variableSource
  })
})

describe('Tool', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all tool fields', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/tools\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'T100000-EDSC'
            },
            umm: {
              AccessConstraints: 'NONE',
              AncillaryKeywords: [],
              ContactGroups: [],
              ContactPersons: [],
              Description: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
              DOI: 'doi:10.4225/15/5747A',
              LongName: 'Etiam Mollis Sem Venenatis',
              MetadataSpecification: {},
              Name: 'Etiam',
              Organizations: [],
              Quality: {},
              RelatedURLs: [],
              SearchAction: {},
              SupportedBrowsers: [],
              SupportedInputFormats: [],
              SupportedOperatingSystems: [],
              SupportedOutputFormats: [],
              SupportedSoftwareLanguages: [],
              ToolKeywords: [],
              Type: 'Vulputate',
              URL: {},
              UseConstraints: {},
              Version: '1.0.0',
              VersionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            }
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          tools {
            count
            items {
              accessConstraints
              ancillaryKeywords
              conceptId
              contactGroups
              contactPersons
              description
              doi
              longName
              metadataSpecification
              name
              organizations
              quality
              relatedUrls
              searchAction
              supportedBrowsers
              supportedInputFormats
              supportedOperatingSystems
              supportedOutputFormats
              supportedSoftwareLanguages
              toolKeywords
              type
              url
              useConstraints
              version
              versionDescription
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        tools: {
          count: 1,
          items: [{
            accessConstraints: 'NONE',
            ancillaryKeywords: [],
            conceptId: 'T100000-EDSC',
            contactGroups: [],
            contactPersons: [],
            description: 'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
            doi: 'doi:10.4225/15/5747A',
            longName: 'Etiam Mollis Sem Venenatis',
            metadataSpecification: {},
            name: 'Etiam',
            organizations: [],
            quality: {},
            relatedUrls: [],
            searchAction: {},
            supportedBrowsers: [],
            supportedInputFormats: [],
            supportedOperatingSystems: [],
            supportedOutputFormats: [],
            supportedSoftwareLanguages: [],
            toolKeywords: [],
            type: 'Vulputate',
            url: {},
            useConstraints: {},
            version: '1.0.0',
            versionDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
          }]
        }
      })
    })

    test('tools', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/tools\.json/, 'page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'T100000-EDSC'
          }, {
            concept_id: 'T100001-EDSC'
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          tools(limit:2) {
            items {
              conceptId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        tools: {
          items: [{
            conceptId: 'T100000-EDSC'
          }, {
            conceptId: 'T100001-EDSC'
          }]
        }
      })
    })

    describe('tool', () => {
      describe('with results', () => {
        test('returns results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/tools\.json/, 'concept_id=T100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'T100000-EDSC'
              }]
            })

          const response = await query({
            variables: {},
            query: `{
              tool(conceptId: "T100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            tool: {
              conceptId: 'T100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns no results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/tools\.json/, 'concept_id=T100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await query({
            variables: {},
            query: `{
              tool(conceptId: "T100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            tool: null
          })
        })
      })
    })
  })
})
