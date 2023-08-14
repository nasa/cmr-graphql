import nock from 'nock'

import {
  buildContextValue,
  server
} from './__mocks__/mockServer'

const contextValue = buildContextValue()

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
              'concept-id': 'V100000-EDSC',
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
              AdditionalIdentifiers: [],
              DataType: 'Dolor Nullam Venenatis',
              Definition: 'Cras mattis consectetur purus sit amet fermentum.',
              Dimensions: {},
              FillValues: [],
              IndexRanges: {},
              InstanceInformation: {},
              LongName: 'Vehicula Aenean Lorem',
              MeasurementIdentifiers: [],
              Name: 'Vehicula',
              Offset: 1.234,
              RelatedURLs: [],
              Scale: 1.234,
              ScienceKeywords: [],
              Sets: [],
              StandardName: 'all values standard name',
              Units: 'K',
              ValidRanges: {},
              VariableSubType: 'SCIENCE_SCALAR',
              VariableType: 'Malesuada'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          variables {
            count
            items {
              additionalIdentifiers
              associationDetails
              conceptId
              dataType
              definition
              dimensions
              fillValues
              indexRanges
              instanceInformation
              longName
              measurementIdentifiers
              name
              nativeId
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
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        variables: {
          count: 1,
          items: [{
            additionalIdentifiers: [],
            associationDetails: {
              collections: [
                {
                  data: '{"XYZ": "XYZ", "allow-regridding": true}',
                  conceptId: 'C100000-EDSC'
                }]
            },
            conceptId: 'V100000-EDSC',
            dataType: 'Dolor Nullam Venenatis',
            definition: 'Cras mattis consectetur purus sit amet fermentum.',
            dimensions: {},
            fillValues: [],
            indexRanges: {},
            instanceInformation: {},
            longName: 'Vehicula Aenean Lorem',
            measurementIdentifiers: [],
            name: 'Vehicula',
            nativeId: 'test-guid',
            offset: 1.234,
            relatedUrls: [],
            scale: 1.234,
            scienceKeywords: [],
            sets: [],
            standardName: 'all values standard name',
            units: 'K',
            validRanges: {},
            variableSubType: 'SCIENCE_SCALAR',
            variableType: 'Malesuada'
          }]
        }
      })
    })

    test('variables', async () => {
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

      const response = await server.executeOperation({
        variables: {},
        query: `{
          variables (limit:2) {
            items {
              conceptId
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

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

          const response = await server.executeOperation({
            variables: {},
            query: `{
              variable (conceptId: "V100000-EDSC") {
                conceptId
                longName
                name
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

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
          nock(/example/)
            .defaultReplyHeaders({
              'CMR-Took': 0,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .post(/variables\.json/, 'concept_id=V100000-EDSC')
            .reply(200, {
              items: []
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
              variable (conceptId: "V100000-EDSC") {
                conceptId
                longName
                name
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            variable: null
          })
        })
      })
    })
  })

  describe('Variable', () => {
    test('collections', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/variables\.json/)
        .reply(200, {
          items: [{
            concept_id: 'V100000-EDSC'
          }, {
            concept_id: 'V100001-EDSC'
          }]
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/, 'page_size=20&variable_concept_id=V100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }, {
              id: 'C100001-EDSC'
            }]
          }
        })

      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/collections\.json/, 'page_size=20&variable_concept_id=V100001-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100002-EDSC'
            }, {
              id: 'C100003-EDSC'
            }]
          }
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          variables {
            items {
              conceptId
              collections {
                items {
                  conceptId
                }
              }
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        variables: {
          items: [{
            conceptId: 'V100000-EDSC',
            collections: {
              items: [{
                conceptId: 'C100000-EDSC'
              }, {
                conceptId: 'C100001-EDSC'
              }]
            }
          }, {
            conceptId: 'V100001-EDSC',
            collections: {
              items: [{
                conceptId: 'C100002-EDSC'
              }, {
                conceptId: 'C100003-EDSC'
              }]
            }
          }]
        }
      })
    })
  })
})
