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

  // Requested keys that are not UMM must be json
  const jsonKeys = requestedFields.filter((x) => !ummKeys.includes(x))

  // TODO: If all requested fields from one endpoint are available
  // from the other move those keys to the other to prevent unneccesary requests
  return {
    jsonKeys,
    ummKeys,
    ummKeyMappings
  }
}
