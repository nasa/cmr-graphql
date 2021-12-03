/**
 * Parse out and rename parameters used for pagination
 * @param {Object} params Parameters provided in the request
 */
export const handlePagingParams = (searchParams, defaultPageSize = 20) => {
  // Top level limit is deprecated, will remove at some point
  const { limit, params = {} } = searchParams

  // Limit should be nested within params
  const { limit: nestedLimit } = params

  // Remove the param defined by the graph spec
  // eslint-disable-next-line no-param-reassign
  delete searchParams.limit

  return {
    ...searchParams,
    // Prefer the nestedLimit over top level limit
    pageSize: nestedLimit || limit || defaultPageSize
  }
}
