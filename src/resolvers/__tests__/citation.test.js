import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('Citation', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('all citation fields', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/citations\.json/)
        .reply(200, {
          hits: 1,
          took: 9,
          items: [
            {
              concept_id: 'CIT100000-EDSC',
              revision_id: 3,
              provider_id: 'EDSC',
              native_id: 'test',
              name: 'mock-citation',
              id: 'mock-id'
            }
          ]
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 1,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/citations\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'revision-id': 3,
              deleted: false,
              'provider-id': 'DEMO_PROV',
              'user-id': 'EDSC',
              'native-id': 'test',
              'concept-id': 'CIT100000-EDSC',
              'revision-date': '2025-05-07T15:32:54.675Z',
              'concept-type': 'citation'
            },
            umm: {
              ResolutionAuthority: 'https://doi.org',
              ScienceKeywords: [
                {
                  Category: 'EARTH SCIENCE',
                  Topic: 'ATMOSPHERE',
                  Term: 'AIR QUALITY',
                  VariableLevel1: 'NITROGEN DIOXIDE'
                },
                {
                  Category: 'EARTH SCIENCE',
                  Topic: 'HUMAN DIMENSIONS',
                  Term: 'PUBLIC HEALTH',
                  VariableLevel1: 'ENVIRONMENTAL IMPACTS'
                }
              ],
              RelatedIdentifiers: [
                {
                  RelationshipType: 'Cites',
                  RelatedIdentifierType: 'DOI',
                  RelatedIdentifier: '10.5067/MODIS/MOD08_M3.061',
                  RelatedResolutionAuthority: 'https://doi.org'
                },
                {
                  RelationshipType: 'Refers',
                  RelatedIdentifierType: 'DOI',
                  RelatedIdentifier: '10.5067/MEASURES/AEROSOLS/DATA203',
                  RelatedResolutionAuthority: 'https://doi.org'
                }
              ],
              Abstract: 'The global pandemic caused by the coronavirus disease 2019 (COVID-19) led to never-before-seen reductions in urban and industrial activities, along with associated emissions to the environment. This has created an unprecedented opportunity to study atmospheric composition in the absence of its usual drivers. We have combined surface-level nitrogen dioxide (NO2) observations from air quality monitoring stations across the globe with satellite measurements and machine learning techniques to analyze NO2 variations from the initial strict lockdowns through the restrictions that continued into fall 2020. Our analysis shows that the restrictions led to significant decreases in NO2 concentrations globally through 2020.',
              Name: 'Citation-Name',
              IdentifierType: 'DOI',
              Identifier: '10.1029/2021JD034797',
              CitationMetadata: {
                Type: 'journal-article',
                Volume: '126',
                Publisher: 'American Geophysical Union',
                Number: '20',
                Title: 'Global Impact of COVID-19 Restrictions on the Atmospheric Concentrations of Nitrogen Dioxide and Ozone',
                Container: 'Journal of Geophysical Research: Atmospheres',
                Year: 2021,
                Author: [
                  {
                    ORCID: '0000-0003-2541-6634',
                    Given: 'Christoph A.',
                    Family: 'Keller',
                    Sequence: 'first'
                  },
                  {
                    ORCID: '0000-0002-6194-7454',
                    Given: 'K. Emma',
                    Family: 'Knowland',
                    Sequence: 'additional'
                  }
                ],
                Pages: 'e2021JD034797'
              },
              MetadataSpecification: {
                URL: 'https://cdn.earthdata.nasa.gov/generics/citation/v1.0.0',
                Name: 'Citation',
                Version: '1.0.0'
              }
            }
          }]
        })

      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 2,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/citations.umm_json?all_revisions=true&concept_id=CIT100000-EDSC')
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'CIT100000-EDSC',
              'native-id': 'test-guid',
              'revision-id': '2',
              'user-id': 'test user',
              'revision-date': '2025-05-28T18:12:19.927Z'
            },
            umm: {
              Name: 'Cras mattis consectetur purus sit amet fermentum.'
            }
          }, {
            meta: {
              'concept-id': 'CIT100000-EDSC',
              'native-id': 'test-guid',
              'revision-id': '1',
              'user-id': 'test user',
              'revision-date': '2025-05-28T18:12:19.927Z'
            },
            umm: {
              Name: 'Cras mattis consectetur purus sit amet fermentum.'
            }
          }]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          citations {
            count
            items {
              abstract
              citationMetadata
              conceptId
              identifier
              identifierType
              name
              nativeId
              providerId
              resolutionAuthority
              relatedIdentifiers
              revisionDate
              revisionId
              revisions {
                count
                items {
                  conceptId
                  revisionDate
                  revisionId
                  userId
                }
              }
              scienceKeywords
              ummMetadata
              userId
            }
          }
        }`
      }, {
        contextValue
      })

      const { data, errors } = response.body.singleResult

      expect(errors).toBeUndefined()

      expect(data).toEqual({
        citations: {
          count: 1,
          items: [
            {
              abstract: 'The global pandemic caused by the coronavirus disease 2019 (COVID-19) led to never-before-seen reductions in urban and industrial activities, along with associated emissions to the environment. This has created an unprecedented opportunity to study atmospheric composition in the absence of its usual drivers. We have combined surface-level nitrogen dioxide (NO2) observations from air quality monitoring stations across the globe with satellite measurements and machine learning techniques to analyze NO2 variations from the initial strict lockdowns through the restrictions that continued into fall 2020. Our analysis shows that the restrictions led to significant decreases in NO2 concentrations globally through 2020.',
              citationMetadata: {
                type: 'journal-article',
                volume: '126',
                publisher: 'American Geophysical Union',
                number: '20',
                title: 'Global Impact of COVID-19 Restrictions on the Atmospheric Concentrations of Nitrogen Dioxide and Ozone',
                container: 'Journal of Geophysical Research: Atmospheres',
                year: 2021,
                author: [
                  {
                    orcid: '0000-0003-2541-6634',
                    given: 'Christoph A.',
                    family: 'Keller',
                    sequence: 'first'
                  },
                  {
                    orcid: '0000-0002-6194-7454',
                    given: 'K. Emma',
                    family: 'Knowland',
                    sequence: 'additional'
                  }
                ],
                pages: 'e2021JD034797'
              },
              conceptId: 'CIT100000-EDSC',
              identifier: '10.1029/2021JD034797',
              identifierType: 'DOI',
              name: 'Citation-Name',
              nativeId: 'test',
              providerId: 'EDSC',
              resolutionAuthority: 'https://doi.org',
              relatedIdentifiers: [
                {
                  relationshipType: 'Cites',
                  relatedIdentifierType: 'DOI',
                  relatedIdentifier: '10.5067/MODIS/MOD08_M3.061',
                  relatedResolutionAuthority: 'https://doi.org'
                },
                {
                  relationshipType: 'Refers',
                  relatedIdentifierType: 'DOI',
                  relatedIdentifier: '10.5067/MEASURES/AEROSOLS/DATA203',
                  relatedResolutionAuthority: 'https://doi.org'
                }
              ],
              revisionDate: '2025-05-07T15:32:54.675Z',
              revisionId: '3',
              revisions: {
                count: 2,
                items: [
                  {
                    conceptId: 'CIT100000-EDSC',
                    revisionDate: '2025-05-28T18:12:19.927Z',
                    revisionId: '2',
                    userId: 'test user'
                  },
                  {
                    conceptId: 'CIT100000-EDSC',
                    revisionDate: '2025-05-28T18:12:19.927Z',
                    revisionId: '1',
                    userId: 'test user'
                  }
                ]
              },
              scienceKeywords: [
                {
                  category: 'EARTH SCIENCE',
                  topic: 'ATMOSPHERE',
                  term: 'AIR QUALITY',
                  variableLevel1: 'NITROGEN DIOXIDE'
                },
                {
                  category: 'EARTH SCIENCE',
                  topic: 'HUMAN DIMENSIONS',
                  term: 'PUBLIC HEALTH',
                  variableLevel1: 'ENVIRONMENTAL IMPACTS'
                }
              ],
              ummMetadata: {
                Abstract: 'The global pandemic caused by the coronavirus disease 2019 (COVID-19) led to never-before-seen reductions in urban and industrial activities, along with associated emissions to the environment. This has created an unprecedented opportunity to study atmospheric composition in the absence of its usual drivers. We have combined surface-level nitrogen dioxide (NO2) observations from air quality monitoring stations across the globe with satellite measurements and machine learning techniques to analyze NO2 variations from the initial strict lockdowns through the restrictions that continued into fall 2020. Our analysis shows that the restrictions led to significant decreases in NO2 concentrations globally through 2020.',
                CitationMetadata: {
                  Author: [
                    {
                      Family: 'Keller',
                      Given: 'Christoph A.',
                      ORCID: '0000-0003-2541-6634',
                      Sequence: 'first'
                    },
                    {
                      Family: 'Knowland',
                      Given: 'K. Emma',
                      ORCID: '0000-0002-6194-7454',
                      Sequence: 'additional'
                    }
                  ],
                  Container: 'Journal of Geophysical Research: Atmospheres',
                  Number: '20',
                  Pages: 'e2021JD034797',
                  Publisher: 'American Geophysical Union',
                  Title: 'Global Impact of COVID-19 Restrictions on the Atmospheric Concentrations of Nitrogen Dioxide and Ozone',
                  Type: 'journal-article',
                  Volume: '126',
                  Year: 2021
                },
                Identifier: '10.1029/2021JD034797',
                IdentifierType: 'DOI',
                MetadataSpecification: {
                  Name: 'Citation',
                  URL: 'https://cdn.earthdata.nasa.gov/generics/citation/v1.0.0',
                  Version: '1.0.0'
                },
                Name: 'Citation-Name',
                RelatedIdentifiers: [
                  {
                    RelatedIdentifier: '10.5067/MODIS/MOD08_M3.061',
                    RelatedIdentifierType: 'DOI',
                    RelatedResolutionAuthority: 'https://doi.org',
                    RelationshipType: 'Cites'
                  },
                  {
                    RelatedIdentifier: '10.5067/MEASURES/AEROSOLS/DATA203',
                    RelatedIdentifierType: 'DOI',
                    RelatedResolutionAuthority: 'https://doi.org',
                    RelationshipType: 'Refers'
                  }
                ],
                ResolutionAuthority: 'https://doi.org',
                ScienceKeywords: [
                  {
                    Category: 'EARTH SCIENCE',
                    Term: 'AIR QUALITY',
                    Topic: 'ATMOSPHERE',
                    VariableLevel1: 'NITROGEN DIOXIDE'
                  },
                  {
                    Category: 'EARTH SCIENCE',
                    Term: 'PUBLIC HEALTH',
                    Topic: 'HUMAN DIMENSIONS',
                    VariableLevel1: 'ENVIRONMENTAL IMPACTS'
                  }
                ]
              },
              userId: 'EDSC'
            }
          ]
        }
      })
    })

    describe('citations', () => {
      describe('with results', () => {
        test('returns results', async () => {
          nock(/example-cmr/)
            .defaultReplyHeaders({
              'CMR-Took': 7,
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get('/search/citations.json?concept_id=CIT100000-EDSC')
            .reply(200, {
              items: [{
                concept_id: 'CIT100000-EDSC'
              }]
            })

          const response = await server.executeOperation({
            variables: {},
            query: `{
                  citation (params: { conceptId: "CIT100000-EDSC" }) {
                    conceptId
                  }
                }`
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            citation: {
              conceptId: 'CIT100000-EDSC'
            }
          })
        })
      })
    })
  })

  describe('Mutation', () => {
    test('deleteCitation', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .delete(/ingest\/providers\/EDSC\/citations\/test-guid/)
        .reply(201, {
          'concept-id': 'CIT100000-EDSC',
          'revision-id': '2'
        })

      const response = await server.executeOperation({
        variables: {
          nativeId: 'test-guid',
          providerId: 'EDSC'
        },
        query: `mutation DeleteCitation (
          $providerId: String!
          $nativeId: String!
        ) {
          deleteCitation (
            providerId: $providerId
            nativeId: $nativeId
          ) {
              conceptId
              revisionId
            }
          }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        deleteCitation: {
          conceptId: 'CIT100000-EDSC',
          revisionId: '2'
        }
      })
    })
  })
})
