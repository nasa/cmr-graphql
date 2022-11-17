import nock from 'nock'

import { ApolloServer } from 'apollo-server-lambda'

import resolvers from '..'
import typeDefs from '../../types'

import gridSource from '../../datasources/grid'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    headers: {
      'CMR-Request-Id': 'abcd-1234-efgh-5678'
    }
  }),
  dataSources: () => ({
    gridSource
  })
})

describe('Grid', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all grid fields', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/grids\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'GRD100000-EDSC'
            },
            umm: {
              RelatedURLs: {},
              Organization: {
                ContactMechanisms: {}
              },
              AdditionalAttribute: {},
              Description: 'grid_desc',
              GridDefinition: {
                DimensionSize: {},
                Resolution: {},
                SpatialExtent: {},
                ScaleExtent: {}
              },
              Version: '0.0.1',
              MetadataDate: {},
              Name: 'grid_name',
              MetadataSpecification: {},
              LongName: 'grid_long_name'
            }
          }]
        })

      const response = await server.executeOperation({
        grids: {},
        query: `{
          grids {
            count
            items {
              conceptId
              relatedUrls
              organization
              contactMechanisms
              additionalAttribute
              description
              gridDefinition
              dimensionSize
              resolution
              spatialExtent
              scaleExtent
              version
              metadataDate
              name
              metadataSpecification
              longName
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        grids: {
          count: 1,
          items: [{
            conceptId: 'GRD100000-EDSC',
            relatedUrls: {},
            organization: {
              contactMechanisms: {}
            },
            contactMechanisms: {},
            additionalAttribute: {},
            description: 'grid_desc',
            gridDefinition: {
              dimensionSize: {},
              resolution: {},
              spatialExtent: {},
              scaleExtent: {}
            },
            dimensionSize: {},
            resolution: {},
            spatialExtent: {},
            scaleExtent: {},
            version: '0.0.1',
            metadataDate: {},
            name: 'grid_name',
            metadataSpecification: {},
            longName: 'grid_long_name'
          }]
        }
      })
    })

    test('grids', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/grids\.json/)
        .reply(200, {
          items: [{
            concept_id: 'GRD100000-EDSC'
          }, {
            concept_id: 'GRD100001-EDSC'
          }]
        })

      const response = await server.executeOperation({
        grids: {},
        query: `{
          grids{
            items {
              conceptId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        grids: {
          items: [{
            conceptId: 'GRD100000-EDSC'
          }, {
            conceptId: 'GRD100001-EDSC'
          }]
        }
      })
    })

    describe('grid', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/grids\.json/, 'concept_id=GRD100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'GRD100000-EDSC',
                name: 'Lorem Ipsum'
              }]
            })

          const response = await server.executeOperation({
            grids: {},
            query: `{
              grid(conceptId: "GRD100000-EDSC") {
                conceptId
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            grid: {
              conceptId: 'GRD100000-EDSC'
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
            .post(/grids\.json/, 'concept_id=GRD100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await server.executeOperation({
            grids: {},
            query: `{
              grid(conceptId: "GRD100000-EDSC") {
                conceptId
                name
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            grid: null
          })
        })
      })
    })
  })
})
