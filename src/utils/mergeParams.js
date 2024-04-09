/**
 * Merges the nested `params` object into the top level parameters of a query or mutation
 * @param {Object} fullParams Parameters provided by the GraphQL query/mutation
 */
export const mergeParams = (fullParams = {}) => {
  const { params = {} } = fullParams

  const returnParams = {
    ...fullParams,
    ...params
  }

  // Delete the params key, those values have been moved to the top level
  // This ensures ingest validation does not fail on a `params` key
  delete returnParams.params

  return returnParams
}
