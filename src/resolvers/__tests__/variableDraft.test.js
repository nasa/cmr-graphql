import nock from 'nock'

import {
  buildContextValue,
  server
} from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Variable Draft', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    describe('variableDraft', () => {
      describe('with results', () => {
        test('all variable draft fields', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/api\/variable_drafts/)
            .reply(200, {
              draft: {
                AdditionalIdentifiers: [],
                DataType: 'byte',
                Definition: 'Mock Definition',
                Dimensions: {},
                FillValues: [],
                IndexRanges: {},
                InstanceInformation: {},
                LongName: 'Mock Long Name',
                MeasurementIdentifiers: [],
                Name: 'Mock Variable Draft Name',
                Offset: 1.234,
                RelatedURLs: [],
                Scale: 1.234,
                ScienceKeywords: [],
                Sets: [],
                StandardName: 'Mock Standard Name',
                Units: 'K',
                ValidRanges: {},
                VariableSubType: 'SCIENCE_SCALAR',
                VariableType: 'Mock Variable Types'
              }
            })
          const response = await server.executeOperation({
            variables: {},
            query: `{
              variableDraft (params: { id: 123 }) {
                additionalIdentifiers
                dataType
                definition
                dimensions
                fillValues
                indexRanges
                instanceInformation
                longName
                measurementIdentifiers
                name
                offset
                relatedUrls
                scale
                scienceKeywords
                sets
                standardName
                units
                validRanges
                variableSubType
                variableType
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            variableDraft: {
              additionalIdentifiers: [],
              dataType: 'byte',
              definition: 'Mock Definition',
              dimensions: {},
              fillValues: [],
              indexRanges: {},
              instanceInformation: {},
              longName: 'Mock Long Name',
              measurementIdentifiers: [],
              name: 'Mock Variable Draft Name',
              offset: 1.234,
              relatedUrls: [],
              scale: 1.234,
              scienceKeywords: [],
              sets: [],
              standardName: 'Mock Standard Name',
              units: 'K',
              validRanges: {},
              variableSubType: 'SCIENCE_SCALAR',
              variableType: 'Mock Variable Types'
            }
          })
        })
        test('returns results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/api\/variable_drafts/)
            .reply(200, {
              draft: {
                StandardName: 'Mock Standard Name'
              }
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              variableDraft (params: { id: 123 }) {
                standardName
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            variableDraft: {
              standardName: 'Mock Standard Name'
            }
          })
        })
      })
    })
  })
})
