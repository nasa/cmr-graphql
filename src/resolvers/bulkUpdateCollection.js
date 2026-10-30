export default {
  Query: {
    bulkUpdateCollectionTasks: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.bulkUpdateCollectionTasksSourceFetch(args, context)
    },

    bulkUpdateCollectionTask: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.bulkUpdateCollectionTaskSourceFetch(args, context)
    }
  },

  Mutation: {
    createBulkUpdateCollectionTask: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.bulkUpdateCollectionTaskSourceCreate(args, context)
    }
  }
}
