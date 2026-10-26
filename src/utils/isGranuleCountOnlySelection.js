import isEmpty from 'lodash/isEmpty'

/**
 * Returns true when a parsed field node (from graphql-parse-resolve-info) represents
 * a `granules` selection that asks for `count` and nothing else, with no arguments.
 * Used to decide whether to use the parent collection's `granule_count` value instead
 * of making a separate granule search request.
 *
 * @param {Object} fieldNode – the parsed field object, e.g. `{ name, args, fieldsByTypeName }`
 */
export const isGranuleCountOnlySelection = (fieldNode) => {
  const { name, args = {}, fieldsByTypeName = {} } = fieldNode

  if (name !== 'granules' || !isEmpty(args)) return false

  const { GranuleList: granuleListFields = {} } = fieldsByTypeName

  if (isEmpty(granuleListFields)) return false

  return Object.values(granuleListFields).every((field) => field.name === 'count')
}
