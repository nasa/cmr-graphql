/**
 * Accepts a full UMM response and attempts to find a record that matches the provided revision id
 * throws an error is the revisionId has been deleted by CMR
 * @param {Object} ummResponse The response body of a CMR UMM_JSON search
 * @param {String} revisionId Revision ID to look for in the ummResponse
 * @returns Return a CMR UMM record that matches the revision id provided
 * @throws Error if the requested revision is no longer stored
 */
export const findPreviousRevision = (ummResponse, revisionId) => {
  const {
    items: responseItems
  } = ummResponse

  // Determine if revisionId requested still exists
  // CMR only stores the ten most recent revisions
  const mostRecentRevisionId = parseInt(responseItems[0].meta['revision-id'], 10)
  const oldestAvailableRevision = Math.max(1, mostRecentRevisionId - 9)
  const requestedRevisionId = parseInt(revisionId, 10)

  if (requestedRevisionId < oldestAvailableRevision) {
    throw new Error(`Revision ${revisionId} is no longer stored. Please select an available revision from ${oldestAvailableRevision} to ${mostRecentRevisionId}.`)
  }

  return responseItems.find((item) => {
    const { meta } = item
    const { 'revision-id': itemRevisionId } = meta

    return (itemRevisionId.toString() === revisionId)
  })
}
