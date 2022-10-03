import { stringify } from 'qs'

/**
 * Create a query string containing both indexed and non-indexed keys.
 * @param {Object} queryParams - An object containing all queryParams.
 * @param {Array} nonIndexedKeys - An array of strings that represent the keys which should not be indexed.
 * @return {String} A query string containing both indexed and non-indexed keys.
 */
export const prepKeysForCmr = (queryParams, nonIndexedKeys = []) => {
  const nonIndexedAttrs = {}
  const indexedAttrs = { ...queryParams }

  nonIndexedKeys.forEach((key) => {
    nonIndexedAttrs[key] = indexedAttrs[key]
    delete indexedAttrs[key]
  })

  return [
    stringify(indexedAttrs, { encode: false }),
    stringify(nonIndexedAttrs, {
      encode: false,
      indices: false,
      arrayFormat: 'brackets'
    })
  ].filter(Boolean).join('&')
}
