import pick from 'lodash/pick'

import { downcaseKeys } from './downcaseKeys'

/**
 * Pick values from an object using a case insensitive search but returning the cased key
 * @param {Object} input Object to pick from
 * @param {Array<String>} keys Array of strings matching the keys to pick out of the provided input
 */
export const pickIgnoringCase = (input = {}, keys = []) => {
  // Object to fill and return
  const pickedByKeys = {}

  keys.forEach((key) => {
    // Look for the value by the provided key
    let { [key]: pickedValue } = input

    // If the key isn't found as it was provided
    if (pickedValue == null) {
      // Downcase they keys of the object as well as the provided to see if
      // it exists with a different case, if it is found this way set the value
      ({ [key.toLowerCase()]: pickedValue } = downcaseKeys(input))
    }

    if (pickedValue != null) {
      // If the key was found set a key/value in the return object matching the actual key
      pickedByKeys[key] = pickedValue
    }
  })

  return pick(
    pickedByKeys,
    keys
  )
}
