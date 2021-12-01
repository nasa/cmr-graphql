/**
 * Merges the nested `params` object into the top level parameters of a query or mutation
 * @param {Object} fullParams Parameters provided by the GraphQL query/mutation
 */
export const mergeParams = (fullParams) => {
  const { params = {} } = fullParams

  return {
    ...fullParams,
    ...params
  }
}
