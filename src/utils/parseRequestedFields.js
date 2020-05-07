/**
 * Construct an object defining UMM key information
 * @param {Array} requestedFields Fields requested
 * @param {Object} ummKeyMappings Mappings of UMM fields to requestable fields
 */
export const parseRequestedFields = (requestedFields, ummKeyMappings) => {
  // Gather keys that the user requested that only exist in umm
  const ummKeys = requestedFields.filter((x) => (
    Object.keys(ummKeyMappings).includes(x)
  ))

  const jsonKeys = requestedFields.filter((x) => !ummKeys.includes(x))

  return {
    jsonKeys,
    ummKeys,
    ummKeyMappings
  }
}
