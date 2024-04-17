/**
 * Parse a concept id and return only the provider piece
 * @param {String} conceptId A unique id belonging to a CMR concept
 * @returns The Provider the provided concept belongs to
 */
export const getProviderFromConceptId = (conceptId) => {
  const [, provider] = conceptId.split('-')

  return provider
}
