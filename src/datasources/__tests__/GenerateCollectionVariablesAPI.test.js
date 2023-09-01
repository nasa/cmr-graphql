import nock from 'nock'

import { GenerateCollectionVariablesAPI } from '../GenerateCollectionVariablesAPI'

describe('generateVariables', () => {
  describe('with localhost', () => {
    it('should return a list of variable drafts', async () => {
      const variableList = [
        {
          name: 'Grid/time',
          longName: 'Grid/time',
          standardName: 'time',
          definition: 'Grid/time',
          dataType: 'int32',
          dimensions: [
            {
              Name: 'Grid/time',
              Size: 1,
              Type: 'TIME_DIMENSION'
            }
          ],
          units: 'seconds since 1970-01-01 00:00:00 UTC',
          metadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2',
            Name: 'UMM-Var',
            Version: '1.8.2'
          }
        },
        {
          name: 'Grid/lon',
          longName: 'Grid/lon',
          standardName: 'longitude',
          definition: 'Grid/lon',
          dataType: 'float32',
          dimensions: [
            {
              Name: 'Grid/lon',
              Size: 3600,
              Type: 'LONGITUDE_DIMENSION'
            }
          ],
          units: 'degrees_east',
          metadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2',
            Name: 'UMM-Var',
            Version: '1.8.2'
          }
        }
      ]

      nock(/localhost/)
        .get(/earthdataVarinfo/)
        .reply(200, [
          {
            Name: 'Grid/time',
            LongName: 'Grid/time',
            StandardName: 'time',
            Definition: 'Grid/time',
            DataType: 'int32',
            Dimensions: [
              {
                Name: 'Grid/time',
                Size: 1,
                Type: 'TIME_DIMENSION'
              }
            ],
            Units: 'seconds since 1970-01-01 00:00:00 UTC',
            MetadataSpecification: {
              URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2',
              Name: 'UMM-Var',
              Version: '1.8.2'
            }
          },
          {
            Name: 'Grid/lon',
            LongName: 'Grid/lon',
            StandardName: 'longitude',
            Definition: 'Grid/lon',
            DataType: 'float32',
            Dimensions: [
              {
                Name: 'Grid/lon',
                Size: 3600,
                Type: 'LONGITUDE_DIMENSION'
              }
            ],
            Units: 'degrees_east',
            MetadataSpecification: {
              URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2',
              Name: 'UMM-Var',
              Version: '1.8.2'
            }
          }
        ])

      const generateCollectionVariablesAPI = new GenerateCollectionVariablesAPI('localhost', 'testtoken')
      const variableDrafts = await generateCollectionVariablesAPI.generateVariables('C1234-TEST')
      expect(variableDrafts).toStrictEqual(variableList)
    })
  })
  describe('with not localhost', () => {
    it('should return a list of variable drafts', async () => {
      const variableList = [
        {
          name: 'Grid/time',
          longName: 'Grid/time',
          standardName: 'time',
          definition: 'Grid/time',
          dataType: 'int32',
          dimensions: [
            {
              Name: 'Grid/time',
              Size: 1,
              Type: 'TIME_DIMENSION'
            }
          ],
          units: 'seconds since 1970-01-01 00:00:00 UTC',
          metadataSpecification: {
            URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2',
            Name: 'UMM-Var',
            Version: '1.8.2'
          }
        }
      ]

      nock(/earthdata/)
        .get(/earthdataVarinfo/)
        .reply(200, [
          {
            Name: 'Grid/time',
            LongName: 'Grid/time',
            StandardName: 'time',
            Definition: 'Grid/time',
            DataType: 'int32',
            Dimensions: [
              {
                Name: 'Grid/time',
                Size: 1,
                Type: 'TIME_DIMENSION'
              }
            ],
            Units: 'seconds since 1970-01-01 00:00:00 UTC',
            MetadataSpecification: {
              URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2',
              Name: 'UMM-Var',
              Version: '1.8.2'
            }
          }
        ])

      const generateCollectionVariablesAPI = new GenerateCollectionVariablesAPI('earthdata', 'testtoken')
      const variableDrafts = await generateCollectionVariablesAPI.generateVariables('C1234-TEST')
      expect(variableDrafts).toStrictEqual(variableList)
    })
  })
})
