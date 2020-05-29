import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON from 'graphql-type-json'

const schemaString = 'scalar JSON'
const resolveFunctions = {
  JSON: GraphQLJSON
}
export default makeExecutableSchema({ typeDefs: schemaString, resolvers: resolveFunctions })
