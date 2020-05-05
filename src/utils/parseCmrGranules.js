/**
 * Parse the granules search response
 * @param {Object} response CMR response
 */
export const parseCmrGranules = (response) => {
  const { data } = response
  const { feed } = data
  const { entry } = feed

  return entry
}
