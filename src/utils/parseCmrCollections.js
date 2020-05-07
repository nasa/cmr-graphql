/**
 * Parse the collections search response
 * @param {Object} response CMR response
 * @param {String} format CMR format to request
 */
export const parseCmrCollections = (response, format = 'json') => {
  const { data } = response

  if (format === 'json') {
    const { feed } = data

    if (!feed) return []

    const { entry } = feed

    return entry
  }

  if (format === 'umm_json') {
    const { items = [] } = data

    return items
  }

  return []
}
