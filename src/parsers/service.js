/**
 * Parse the service search response
 */
export default (response) => {
  const { data } = response
  const { items } = data

  return items
}
