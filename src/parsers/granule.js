/**
 * Parse the granule search response
 */
export default (response) => {
  const { data } = response
  const { feed } = data
  const { entry } = feed

  return entry
}
