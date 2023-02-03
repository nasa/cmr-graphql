import { parseResolveInfo } from 'graphql-parse-resolve-info'
import { handlePagingParams } from '../utils/handlePagingParams'

export default {
  Query: {
    orderOptions: async (source, args, context, info) => {
      const { dataSources } = context

      // eslint-disable-next-line max-len
      return dataSources.orderOptionSource(handlePagingParams(args), context, parseResolveInfo(info))
    },
    orderOption: async (source, args, context, info) => {
      const { dataSources } = context
      const result = await dataSources.orderOptionSource(args, context, parseResolveInfo(info))

      const [firstResult] = result

      return firstResult
    }
  }
  // ,
  // OrderOption: {
  //   associatedService: async (source, args, context, info) => {
  //     const {
  //       associationDetails = {}
  //     } = source

  //     const { dataSources } = context

  //     const { services = [] } = associationDetails
  //     // TOOD: This won't work they aren't actually assocaited

  //     // TODO: rename this var
  //     // const { data = {} } = services
  //     // TODO: for all of the order_options in this association we grab the
  //     // one in the payload
  //     // then we just pass that to the datasource for order-options to get those back

  //     const serviceConceptIds = services.map(({ conceptId }) => conceptId)
  //     // console.log('the services', serviceConceptIds)
  //     // TODO: This needs to have a null case
  //     // const associationPayloads = services.map(({ data }) => data)
  //     // Pull the order-options out of this
  //     // TODO: I don't understand how this is getting pared as a
  //     // const orderOptionConceptIds = associationPayloads.map(({ orderOption = '' }) => orderOption)

  //     // const { orderOptions = [] } = associationDetails

  //     if (!serviceConceptIds.length) {
  //       return {
  //         count: 0,
  //         items: null
  //       }
  //     }

  //     return dataSources.orderOptionSource({
  //       conceptId: serviceConceptIds,
  //       ...handlePagingParams(args, serviceConceptIds.length)
  //     }, context, parseResolveInfo(info))
  //   }

  // }

}
