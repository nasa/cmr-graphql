import { queryCmr } from './queryCmr'

export const queryCmrUmmConcept = (
  conceptType,
  permittedSearchParams,
  headers,
  requestInfo
) => {
  // Default an array to hold the promises we need to make depending on the requested fields
  const promises = []

  const {
    jsonKeys,
    ummKeys
  } = requestInfo

  if (jsonKeys.length > 0) {
    // Construct the promise that will request data from the json endpoint
    promises.push(
      queryCmr(conceptType, permittedSearchParams, headers)
    )
  } else {
    // Push a null promise to the array so that the umm promise always exists as
    // the second element of the promise array
    promises.push(
      new Promise((resolve) => resolve(null))
    )
  }

  // If any requested keys are umm keys, we need to make an additional request to cmr
  if (ummKeys.length > 0) {
    // Construct the promise that will request data from the umm endpoint
    promises.push(
      queryCmr(conceptType, permittedSearchParams, headers, {
        format: 'umm_json'
      })
    )
  } else {
    promises.push(
      new Promise((resolve) => resolve(null))
    )
  }

  return Promise.all(promises)
}
