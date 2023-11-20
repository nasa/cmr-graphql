import Variable from '../variable'

describe('Variable concept', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()
  })

  describe('Variable concept', () => {
    describe('retrieve the parent collection', () => {
      describe('if the nested fields `instanceInformation` or `scienceKeywords` are queried', () => {
        test('Ensure that their child fields return in camelCase', () => {
          const variable = new Variable({}, {}, {})
          const variableConceptId = 'V1200000000-EDSC'
          const jsonKeys = ['instanceInformation', 'scienceKeywords']
          const jsonResponse = {
            data:
            {
              hits: 1,
              took: 9,
              items: [
                {
                  long_name: 'sea surface subskin temperature',
                  definition: 'sea surface subskin temperature in units of kelvin',
                  science_keywords: [
                    {
                      category: 'EARTH SCIENCE',
                      topic: 'SPECTRAL/ENGINEERING',
                      term: 'MICROWAVE',
                      variable_level_1: 'SEA SURFACE TEMPERATURE',
                      variable_level_2: 'MAXIMUM/MINIMUM TEMPERATURE',
                      variable_level_3: '24 HOUR MAXIMUM TEMPERATURE',
                      detailed_variable: 'details_4385'
                    },
                    {
                      category: 'EARTH SCIENCE',
                      topic: 'SPECTRAL/ENGINEERING',
                      term: 'MICROWAVE',
                      variable_level_1: 'MICROWAVE IMAGERY'
                    }
                  ],
                  name: 'sea_surface_temperature this field must be unique',
                  concept_id: variableConceptId,
                  associations: {
                    collections: [
                      'C100000-EDSC'
                    ]
                  },
                  revision_id: 1,
                  provider_id: 'ESDC',
                  native_id: 'new-ed-Variable-2',
                  instance_information: {
                    url: 's3://prod-giovanni-cache.s3.us-west-2.amazonaws.com/zarr/GPM_3IMERGHH_06_precipitationCal',
                    format: 'Zarr',
                    description: 'Other brief end user information can go here.',
                    direct_distribution_information: {
                      region: 'us-west-2',
                      s_3_bucket_and_object_prefix_names: [
                        'prod-giovanni-cache',
                        'zarr/GPM_3IMERGHH_06_precipitationCal'
                      ],
                      s_3_credentials_api_endpoint: 'https://api.giovanni.earthdata.nasa.gov/s3credentials',
                      s_3_credentials_api_documentation_url: 'https://disc.gsfc.nasa.gov/information/documents?title=In-region%20Direct%20S3%20Zarr%20Cache%20Access'
                    },
                    chunking_information: 'Chunk size for this example is 1MB. It is optimized for time series.'
                  },
                  association_details: {
                    collections: [
                      {
                        concept_id: 'C100000-EDSC'
                      }
                    ]
                  }
                }
              ]
            }
          }
          variable.parseJson(jsonResponse, jsonKeys)
          expect(variable.items[variableConceptId].scienceKeywords).toEqual([
            {
              category: 'EARTH SCIENCE',
              topic: 'SPECTRAL/ENGINEERING',
              term: 'MICROWAVE',
              variableLevel1: 'SEA SURFACE TEMPERATURE',
              variableLevel2: 'MAXIMUM/MINIMUM TEMPERATURE',
              variableLevel3: '24 HOUR MAXIMUM TEMPERATURE',
              detailedVariable: 'details_4385'
            },
            {
              category: 'EARTH SCIENCE',
              topic: 'SPECTRAL/ENGINEERING',
              term: 'MICROWAVE',
              variableLevel1: 'MICROWAVE IMAGERY'
            }
          ])

          expect(variable.items[variableConceptId].instanceInformation).toEqual({
            url: 's3://prod-giovanni-cache.s3.us-west-2.amazonaws.com/zarr/GPM_3IMERGHH_06_precipitationCal',
            format: 'Zarr',
            description: 'Other brief end user information can go here.',
            directDistributionInformation: {
              region: 'us-west-2',
              s3BucketAndObjectPrefixNames: ['prod-giovanni-cache', 'zarr/GPM_3IMERGHH_06_precipitationCal'],
              s3CredentialsApiEndpoint: 'https://api.giovanni.earthdata.nasa.gov/s3credentials',
              s3CredentialsApiDocumentationUrl: 'https://disc.gsfc.nasa.gov/information/documents?title=In-region%20Direct%20S3%20Zarr%20Cache%20Access'
            },
            chunkingInformation: 'Chunk size for this example is 1MB. It is optimized for time series.'
          })
        })
      })
    })
  })
})
