export default {
  Query: {
    bulkUpdateTasks: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.bulkUpdateTasksSourceFetch(args, context)
    },

    bulkUpdateTask: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.bulkUpdateTaskSourceFetch(args, context)
    }
  },

  Mutation: {
    createBulkUpdateTask: async (source, args, context) => {
      const { dataSources } = context

      return dataSources.bulkUpdateTaskSourceCreate(args, context)
    }
  }
}
