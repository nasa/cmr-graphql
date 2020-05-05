/**
 * Parse the collections search response
 * @param {Object} response CMR response
 */
export const parseCmrCollections = (response) => {
  const { data } = response
  const { feed } = data
  const { entry } = feed

  return entry
}
