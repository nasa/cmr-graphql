/**
 * Parse out and rename parameters used for pagination
 * @param {Object} params Parameters provided in the request
 */
export const handlePagingParams = (params, defaultPageSize = 20) => {
  const { limit: pageSize } = params

  // Remove the param defined by the graph spec
  // eslint-disable-next-line no-param-reassign
  delete params.limit

  return {
    ...params,
    pageSize: pageSize || defaultPageSize
  }
}
