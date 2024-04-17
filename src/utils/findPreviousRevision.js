/**
 * Accepts a full UMM response and attempts to find a record that matches the provided revision id
 * @param {Object} ummResponse The response body of a CMR UMM_JSON search
 * @param {String} revisionId Revision ID to look for in the ummResponse
 * @returns Return a CMR UMM record that matches the revision id provided
 */
export const findPreviousRevision = (ummResponse, revisionId) => {
  const {
    items: responseItems
  } = ummResponse

  return responseItems.find((item) => {
    const { meta } = item
    const { 'revision-id': itemRevisionId } = meta

    return (itemRevisionId.toString() === revisionId)
  })
}
