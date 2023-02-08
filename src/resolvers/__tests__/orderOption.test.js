import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'

import resolvers from '..'
import typeDefs from '../../types'

import orderOptionSource from '../../datasources/orderOption'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'Client-Id': 'eed-test-graphql',
      'CMR-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    orderOptionSource
  })
})

describe('OrderOption', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all order option fields', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/order-options\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'OO100000-EDSC',
              'native-id': 'test-guid',
              'association-details': {
                collections: [
                  {
                    data: '{"XYZ": "XYZ", "allow-regridding": true}',
                    'concept-id': 'C100000-EDSC'
                  }
                ]
              }
            },
            umm: {
              Id: '0B4E0AF0BB4E0AF0BB4R0AF00',
              Name: 'With Browse',
              Description: 'Parturient Dolor Cras Aenean Dapibus',
              Form: "<form xmlns=\"http://echo.nasa.gov/v9/echoforms\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> <model> <instance> <ecs:options xmlns:ecs=\"http://ecs.nasa.gov/options\"> <!-- ECS distribution options example --> <ecs:distribution> <ecs:mediatype> <ecs:value>FtpPull</ecs:value> </ecs:mediatype> <ecs:mediaformat> <ecs:ftppull-format> <ecs:value>FILEFORMAT</ecs:value> </ecs:ftppull-format> </ecs:mediaformat> </ecs:distribution> <ecs:do-ancillaryprocessing>true</ecs:do-ancillaryprocessing> <ecs:ancillary> <ecs:orderBrowse/> </ecs:ancillary> </ecs:options> </instance> </model> <ui> <group id=\"mediaOptionsGroup\" label=\"Media Options\" ref=\"ecs:distribution\"> <output id=\"MediaTypeOutput\" label=\"Media Type:\" relevant=\"ecs:mediatype/ecs:value ='FtpPull'\" type=\"xsd:string\" value=\"'HTTPS Pull'\"/> <output id=\"FtpPullMediaFormatOutput\" label=\"Media Format:\" relevant=\"ecs:mediaformat/ecs:ftppull-format/ecs:value='FILEFORMAT'\" type=\"xsd:string\" value=\"'File'\"/> </group> <group id=\"checkancillaryoptions\" label=\"Additional file options:\" ref=\"ecs:ancillary\" relevant=\"//ecs:do-ancillaryprocessing = 'true'\"> <input label=\"Include associated Browse file in order\" ref=\"ecs:orderBrowse\" type=\"xsd:boolean\"/> </group> </ui> </form>",
              Scope: 'PROVIDER',
              SortKey: 'Name'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
            orderOptions {
                count
                items {
                  associationDetails
                  conceptId
                  description
                  form
                  id
                  name
                  nativeId
                  scope
                  sortKey
                }
            }
          }`
      })

      const { data } = response

      expect(data).toEqual({
        orderOptions: {
          count: 1,
          items: [{
            associationDetails: {
              collections: [
                {
                  data: '{"XYZ": "XYZ", "allow-regridding": true}',
                  conceptId: 'C100000-EDSC'
                }]
            },
            conceptId: 'OO100000-EDSC',
            description: 'Parturient Dolor Cras Aenean Dapibus',
            form: "<form xmlns=\"http://echo.nasa.gov/v9/echoforms\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> <model> <instance> <ecs:options xmlns:ecs=\"http://ecs.nasa.gov/options\"> <!-- ECS distribution options example --> <ecs:distribution> <ecs:mediatype> <ecs:value>FtpPull</ecs:value> </ecs:mediatype> <ecs:mediaformat> <ecs:ftppull-format> <ecs:value>FILEFORMAT</ecs:value> </ecs:ftppull-format> </ecs:mediaformat> </ecs:distribution> <ecs:do-ancillaryprocessing>true</ecs:do-ancillaryprocessing> <ecs:ancillary> <ecs:orderBrowse/> </ecs:ancillary> </ecs:options> </instance> </model> <ui> <group id=\"mediaOptionsGroup\" label=\"Media Options\" ref=\"ecs:distribution\"> <output id=\"MediaTypeOutput\" label=\"Media Type:\" relevant=\"ecs:mediatype/ecs:value ='FtpPull'\" type=\"xsd:string\" value=\"'HTTPS Pull'\"/> <output id=\"FtpPullMediaFormatOutput\" label=\"Media Format:\" relevant=\"ecs:mediaformat/ecs:ftppull-format/ecs:value='FILEFORMAT'\" type=\"xsd:string\" value=\"'File'\"/> </group> <group id=\"checkancillaryoptions\" label=\"Additional file options:\" ref=\"ecs:ancillary\" relevant=\"//ecs:do-ancillaryprocessing = 'true'\"> <input label=\"Include associated Browse file in order\" ref=\"ecs:orderBrowse\" type=\"xsd:boolean\"/> </group> </ui> </form>",
            id: '0B4E0AF0BB4E0AF0BB4R0AF00',
            name: 'With Browse',
            nativeId: 'test-guid',
            scope: 'PROVIDER',
            sortKey: 'Name'
          }]
        }
      })
    })

    test('order options query', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/order-options\.json/)
        .reply(200, {
          items: [{
            concept_id: 'OO100000-EDSC'
          }, {
            concept_id: 'OO100001-EDSC'
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
            orderOptions{
              items {
                conceptId
              }
            }
          }`
      })

      const { data } = response

      expect(data).toEqual({
        orderOptions: {
          items: [{
            conceptId: 'OO100000-EDSC'
          }, {
            conceptId: 'OO100001-EDSC'
          }]
        }
      })
    })

    describe('orderOption', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/order-options\.json/, 'concept_id=OO100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'OO100000-EDSC',
                name: 'Lorem Ipsum'
              }]
            })
          const response = await server.executeOperation({
            variables: {},
            query: `{
                orderOption(params: { conceptId: "OO100000-EDSC" }) {
                  conceptId
                }
              }`
          })

          const { data } = response

          expect(data).toEqual({
            orderOption: {
              conceptId: 'OO100000-EDSC'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/order-options\.json/, 'concept_id=OO100000-EDSC')
            .reply(200, {
              items: []
            })
            // TODO: switch this to using the params
          const response = await server.executeOperation({
            variables: {},
            query: `{
                orderOption(params: { conceptId: "OO100000-EDSC" }) {
                  conceptId
                  name
                }
              }`
          })

          const { data } = response

          expect(data).toEqual({
            orderOption: null
          })
        })
      })
    })
  })
})
