import collectionVariableDraftsSource from '../collectionVariableDrafts'

const payload = {
  Payload: '[{"Name":"Grid/time","LongName":"Grid/time","StandardName":"time","Definition":"Grid/time","DataType":"int32","Dimensions":[{"Name":"Grid/time","Size":1,"Type":"TIME_DIMENSION"}],"Units":"seconds since 1970-01-01 00:00:00 UTC","MetadataSpecification":{"URL":"https://cdn.earthdata.nasa.gov/umm/variable/v1.8.2","Name":"UMM-Var","Version":"1.8.2"}}]'
}

jest.mock('@aws-sdk/client-lambda', () => ({
  LambdaClient: jest.fn(() => ({
    send: () => Promise.resolve(payload)
  })),
  InvocationType: jest.fn(() => ({
    RequestResponse: () => {}
  })),
  LogType: jest.fn(() => ({
    Tail: () => {}
  })),
  InvokeCommand: jest.fn(() => ({
  }))
}))

describe('generateVariables', () => {
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

    const response = await collectionVariableDraftsSource(
      {
        conceptId: 'C1200400842-GHRC'
      },
      {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          authorization: 'testtoken'
        }
      }
    )
    expect(response).toEqual(variableList)
  })
})
