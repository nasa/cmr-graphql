import { cmrOrdering } from '../utils/cmrOrdering'

export default async (params, context) => {
  const { headers } = context

  const query = `query Query($providerId: String!) {
    maxItemsPerOrder(providerId: $providerId)
  }`

  const { providerId } = params
  const variables = {
    providerId
  }

  const response = await cmrOrdering({
    query,
    variables,
    headers
  })

  const { data, errors } = response.data

  if (errors) throw new Error(errors)

  const { maxItemsPerOrder } = data

  return maxItemsPerOrder
}
