import { GraphQLError } from 'graphql'
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
import { parseError } from '../utils/parseError'

export default async (params, context) => {
  const { headers } = context

  const { authorization: authorizationHeader = '' } = downcaseKeys(headers)

  // Split the token by a space (Bearer xxx.xxx.xxx) and take the
  // last element to get just the token without the 'Bearer' identifier
  const token = authorizationHeader.split(' ').pop()

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

  try {
    const response = await lambdaClient.send(lambdaCommand)

    const { Payload: responsePayload } = response

    const parsedResponse = JSON.parse(Buffer.from(responsePayload).toString('utf8'))

    const { body } = parsedResponse

    const { error } = body

    if (error) {
      throw new GraphQLError(error)
    }

    // Return variables with keys formatted
    return body.map((variable) => {
      // Rename each collection's object keys with the camelCased version of the key
      const mappedKeys = mapKeys(variable, (value, key) => camelCase(key))

      // Return the mappedKeys
      return mappedKeys
    })
  } catch (e) {
    return parseError(e, {
      provider: 'VARINFO',
      reThrowError: true
    })
  }
}
