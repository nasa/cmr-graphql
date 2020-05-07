/**
 * Parse the services search response
 * @param {Object} response CMR response
 */
export const parseCmrServices = (response) => {
  const { data } = response
  const { items = [] } = data

  return items
}
