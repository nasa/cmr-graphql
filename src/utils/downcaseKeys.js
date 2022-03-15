import { transform } from 'lodash'

/**
 * Downcase all keys of an object
 * @param {*} obj Object to transform
 * @returns Object with all keys downcased
 */
export const downcaseKeys = (obj = {}) => transform(
  obj,
  // eslint-disable-next-line no-return-assign, no-param-reassign
  (result, value, key) => (result[key.toLowerCase()] = value)
)
