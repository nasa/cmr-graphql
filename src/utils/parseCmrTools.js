/**
 * Parse the tools search response
 * @param {Object} response CMR response
 */
export const parseCmrTools = (response) => {
  const { data } = response
  const { items = [] } = data

  return items
}
