/**
 * Parse the variables search response
 * @param {Object} response CMR response
 */
export const parseCmrVariables = (response) => {
  const { data } = response
  const { items = [] } = data

  return items
}
