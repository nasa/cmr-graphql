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

describe('Variable', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all variable fields', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'V100000-EDSC'
            },
            umm: {
              Alias: 'Etiam',
              DataType: 'Dolor Nullam Venenatis',
              Definition: 'Cras mattis consectetur purus sit amet fermentum.',
              Dimensions: {},
              LongName: 'Vehicula Aenean Lorem',
              MeasurementIdentifiers: [],
              Name: 'Vehicula',
              Offset: 1.234,
              Scale: 1.234,
              ScienceKeywords: [],
              Units: 'K',
              VariableType: 'Malesuada'
            }
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          variables {
            count
            items {
              alias
              conceptId
              dataType
              definition
              dimensions
              longName
              measurementIdentifiers
              name
              offset
              scale
              scienceKeywords
              units
              variableType
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        variables: {
          count: 1,
          items: [{
            alias: 'Etiam',
            conceptId: 'V100000-EDSC',
            dataType: 'Dolor Nullam Venenatis',
            definition: 'Cras mattis consectetur purus sit amet fermentum.',
            dimensions: {},
            longName: 'Vehicula Aenean Lorem',
            measurementIdentifiers: [],
            name: 'Vehicula',
            offset: 1.234,
            scale: 1.234,
            scienceKeywords: [],
            units: 'K',
            variableType: 'Malesuada'
          }]
        }
      })
    })

    test('variables', async () => {
      const { query } = createTestClient(server)

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/, 'page_size=2')
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC'
          }, {
            concept_id: 'V100001-EDSC'
          }]
        })

      const response = await query({
        variables: {},
        query: `{
          variables(limit:2) {
            items {
              conceptId
            }
          }
        }`
      })

      const { data } = response

      expect(data).toEqual({
        variables: {
          items: [{
            conceptId: 'V100000-EDSC'
          }, {
            conceptId: 'V100001-EDSC'
          }]
        }
      })
    })

    describe('variable', () => {
      describe('with results', () => {
        test('returns results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/variables\.json/, 'concept_id=V100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'V100000-EDSC',
                long_name: 'Cras mattis consectetur purus sit amet fermentum.',
                name: 'Lorem Ipsum'
              }]
            })

          const response = await query({
            variables: {},
            query: `{
              variable(conceptId: "V100000-EDSC") {
                conceptId
                longName
                name
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            variable: {
              conceptId: 'V100000-EDSC',
              longName: 'Cras mattis consectetur purus sit amet fermentum.',
              name: 'Lorem Ipsum'
            }
          })
        })
      })

      describe('with no results', () => {
        test('returns results', async () => {
          const { query } = createTestClient(server)

          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/variables\.json/, 'concept_id=V100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await query({
            variables: {},
            query: `{
              variable(conceptId: "V100000-EDSC") {
                conceptId
                longName
                name
              }
            }`
          })

          const { data } = response

          expect(data).toEqual({
            variable: null
          })
        })
      })
    })
  })
})
