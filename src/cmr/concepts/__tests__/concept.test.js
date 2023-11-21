import Concept from '../concept'

describe('concept', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()
  })

  describe('concept', () => {
    describe('getItemCount', () => {
      describe('no keys', () => {
        test('returns 0', () => {
          const concept = new Concept('concept')

          expect(concept.getItemCount()).toEqual(0)
        })
      })

      describe('both json and umm keys', () => {
        test('returns 84', () => {
          const concept = new Concept('concept', {}, {
            jsonKeys: ['jsonKey'],
            ummKeys: ['ummKey']
          })

          concept.setJsonItemCount(84)
          concept.setUmmItemCount(84)

          expect(concept.getItemCount()).toEqual(84)
        })
      })

      describe('both json and umm keys but count is different', () => {
        test('throws an error', () => {
          const concept = new Concept('concept', {}, {
            jsonKeys: ['jsonKey'],
            ummKeys: ['ummKey']
          })

          concept.setJsonItemCount(84)
          concept.setUmmItemCount(32617)

          expect(() => {
            concept.getItemCount()
          }).toThrow('Inconsistent data prevented GraphQL from correctly parsing results (JSON Hits: 84, UMM Hits: 32617)')
        })
      })
    })

    describe('parseJsonBody', () => {
      describe('the nested key is not a tag', () => {
        test('the keys return camelCased', () => {
          const concept = new Concept('concept', {}, [])
          const conceptId = 'C1200000000-EDSC'
          const jsonKeys = ['nestedKey', 'nestedKey2']
          const jsonResponse = {
            data:
                {
                  hits: 1,
                  took: 9,
                  feed: {
                    entry: [{
                      concept_id: conceptId,
                      nested_key: [
                        {
                          key1: 'value',
                          key2: 'value2',
                          snake_key_1: 'value3',
                          snake_key_2: 'value4'
                        },
                        {
                          key1: 'value',
                          key2: 'value2',
                          snake_key_1: 'value3'
                        }
                      ],
                      nested_key_2: {
                        url: 'https://mock.html',
                        format: 'Zarr',
                        description: 'Other brief end user information can go here.',
                        mock_distribution_information: {
                          region: 'us-west-2',
                          s_3_bucket_and_object_prefix_names: [
                            'mock-name-1',
                            'mock-name-2'
                          ],
                          s_3_credentials_api_endpoint: 'https://s3mock.html',
                          s_3_credentials_api_documentation_url: 'https://s3Docsmock.html'
                        },
                        mock_chunking_information: 'Chunk size for this example is 1MB. It is optimized for time series.'
                      }
                    }]
                  }
                }
          }
          concept.parseJson(jsonResponse, jsonKeys)
          expect(concept.items[conceptId].nestedKey).toEqual([
            {
              key1: 'value',
              key2: 'value2',
              snakeKey1: 'value3',
              snakeKey2: 'value4'
            },
            {
              key1: 'value',
              key2: 'value2',
              snakeKey1: 'value3'
            }
          ])

          expect(concept.items[conceptId].nestedKey2).toEqual({
            description: 'Other brief end user information can go here.',
            format: 'Zarr',
            mockChunkingInformation: 'Chunk size for this example is 1MB. It is optimized for time series.',
            mockDistributionInformation: {
              region: 'us-west-2',
              s3BucketAndObjectPrefixNames: ['mock-name-1', 'mock-name-2'],
              s3CredentialsApiDocumentationUrl: 'https://s3Docsmock.html',
              s3CredentialsApiEndpoint: 'https://s3mock.html'
            },
            url: 'https://mock.html'
          })
        })
      })

      describe('the nested key is tag', () => {
        test('the child-keys of the tag return snake_cased', () => {
          const concept = new Concept('concept', {}, [])
          const conceptId = 'C1200000000-EDSC'
          const jsonKeys = ['tags']
          const jsonResponse = {
            data:
                {
                  hits: 1,
                  took: 9,
                  feed: {
                    entry: [{
                      concept_id: conceptId,
                      tags: {
                        'edsc.extra.serverless.collection_capabilities': {
                          data: {
                            cloud_cover: true,
                            day_night_flag: true,
                            granule_online_access_flag: true,
                            orbit_calculated_spatial_domains: false
                          }
                        }
                      }
                    }]
                  }
                }
          }
          concept.parseJson(jsonResponse, jsonKeys)
          expect(concept.items[conceptId].tags).toEqual({
            'edsc.extra.serverless.collection_capabilities': {
              data: {
                cloud_cover: true,
                day_night_flag: true,
                granule_online_access_flag: true,
                orbit_calculated_spatial_domains: false
              }
            }
          })
        })
      })
    })
  })
})
