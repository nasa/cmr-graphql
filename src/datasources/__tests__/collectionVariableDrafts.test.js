import { mockClient } from 'aws-sdk-client-mock'
import {
  InvokeCommand,
  LambdaClient
} from '@aws-sdk/client-lambda'

import collectionVariableDraftsSource from '../collectionVariableDrafts'

const lambdaClientMock = mockClient(LambdaClient)

beforeEach(() => {
  lambdaClientMock.reset()
})

describe('collectionVariableDrafts', () => {
  describe('when the call to the lambda is successful', () => {
    it('should return a list of variable drafts', async () => {
      const variableList = [
        {
          name: 'Griddd/time',
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

      lambdaClientMock.on(InvokeCommand).resolves({
        Payload: Buffer.from(JSON.stringify({
          isBase64Encoded: false,
          statusCode: 200,
          body: variableList
        }))
      })

      const response = await collectionVariableDraftsSource(
        {
          conceptId: 'C100000-EDSC'
        },
        {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }
      )

      expect(response).toEqual(variableList)
    })
  })

  describe('when the call to the lambda results in an error', () => {
    it('should return an error', async () => {
      lambdaClientMock.on(InvokeCommand).resolves({
        Payload: Buffer.from(JSON.stringify({
          isBase64Encoded: false,
          statusCode: 200,
          body: {
            error: 'Error from varinfo'
          }
        }))
      })

      await expect(
        collectionVariableDraftsSource(
          {
            conceptId: 'C100000-EDSC'
          },
          {
            headers: {
              'Client-Id': 'eed-test-graphql',
              'CMR-Request-Id': 'abcd-1234-efgh-5678'
            }
          }
        )
      ).rejects.toThrow(Error)
    })
  })
})
