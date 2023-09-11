import {
  InvocationType,
  InvokeCommand,
  LambdaClient,
  LogType
} from '@aws-sdk/client-lambda'

import camelCase from 'lodash/camelCase'
import mapKeys from 'lodash/mapKeys'

import { downcaseKeys } from '../utils/downcaseKeys'
import { getLambdaConfig } from '../utils/aws/getLambdaConfig'

export default async (params, context) => {
  const { headers } = context

  const { authorization: token } = downcaseKeys(headers)

  const lambdaClient = new LambdaClient(getLambdaConfig())

  const lambdaCommand = new InvokeCommand({
    FunctionName: `graphql-${process.env.stage}-earthdataVarinfo`,
    InvocationType: InvocationType.RequestResponse,
    LogType: LogType.Tail,
    Payload: JSON.stringify({
      ...params,
      token
    })
  })

  const results = await lambdaClient.send(lambdaCommand)

  // Parse the Lambda response
  const parsedResults = JSON.parse(Buffer.from(results.Payload).toString('utf8'))

  // Return variables with keys formatted
  return parsedResults.map((variable) => {
    // Rename each collection's object keys with the camelCased version of the key
    const mappedKeys = mapKeys(variable, (value, key) => camelCase(key))

    // Return the mappedKeys
    return mappedKeys
  })
}
