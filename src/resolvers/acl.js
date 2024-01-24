import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'


export default {
  Query: {
    acl: async (source, args, context, info) => {
      const { dataSources } = context

      console.log('acl info 1', info)

      //const result = await dataSources.aclSource(handlePagingParams(args), context, parseResolveInfo(info))
      const result = await dataSources.aclSource(args, context, parseResolveInfo(info))

      //console.log('acl context 2', context)

      console.log('acl result 3', result)

      const [firstResult] = result
      
      //console.log('Result@🚀', result)

      return firstResult
    }
  }
}