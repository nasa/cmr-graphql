import { cmrQuery } from '../utils/cmrQuery'
import { getProviderFromConceptId } from '../utils/getProviderFromConceptId'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

import Collection from '../cmr/concepts/collection'
import { findPreviousRevision } from '../utils/findPreviousRevision'

export const fetchCollections = async (params, context, parsedInfo) => {
  const { headers } = context

  const { revisionId, conceptId } = params

  // If a specific revisionId is requested, fetch all revisions and filter
  if (revisionId) {
    const allRevisionsParams = {
      ...params,
      allRevisions: true
    }

    // Parse requested fields - this determines which fields to fetch
    const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection', allRevisionsParams)

    // Ensure revisionId is included in the requested fields so we can filter by it
    const { ummKeys } = requestInfo
    if (!ummKeys.includes('revisionId')) {
      ummKeys.push('revisionId')
    }

    const collection = new Collection(headers, requestInfo, allRevisionsParams)

    // Query CMR for all revisions
    collection.fetch(allRevisionsParams)

    // Parse the response from CMR
    await collection.parse(requestInfo)

    // Get all items and filter for the specific revision
    const allItems = collection.getFormattedResponse()

    // Convert revisionId to string for comparison since CMR returns it as a string
    const requestedRevisionIdStr = String(revisionId)

    // For a single collection query with revisionId, return just that revision
    const specificRevision = allItems.find((item) => (
      String(item.revisionId) === requestedRevisionIdStr
    ))

    if (!specificRevision) {
      // Check if the revision exists but is too old (CMR only keeps last 10)
      const latestRevisionId = allItems.length > 0 ? parseInt(allItems[0].revisionId, 10) : 0
      const oldestAvailableRevision = Math.max(1, latestRevisionId - 9)
      const requestedRevisionId = parseInt(revisionId, 10)

      if (requestedRevisionId < oldestAvailableRevision) {
        throw new Error(`Revision ${revisionId} is no longer stored. Please select an available revision from ${oldestAvailableRevision} to ${latestRevisionId}.`)
      }

      throw new Error(`Revision ${revisionId} not found for collection ${conceptId}. Available revisions: ${allItems.map((item) => item.revisionId).join(', ')}`)
    }

    return [specificRevision]
  }

  // Normal case: no revisionId specified, return latest revision
  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection', params)

  const collection = new Collection(headers, requestInfo, params)

  // Query CMR
  collection.fetch(params)

  // Parse the response from CMR
  await collection.parse(requestInfo)

  // Return a formatted JSON response
  return collection.getFormattedResponse()
}

export const restoreCollectionRevision = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  const {
    ingestKeys
  } = requestInfo

  const collection = new Collection(headers, requestInfo, args)

  const {
    conceptId,
    revisionId
  } = args

  const authToken = headers.Authorization

  let previousRevisions

  try {
    previousRevisions = await cmrQuery({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authToken
      },
      conceptType: 'collections',
      options: {
        format: 'umm_json'
      },
      params: {
        conceptId,
        allRevisions: true
      }
    })

    if (previousRevisions.data.hits === 0) {
      throw new Error('No previous revisions for this conceptId found')
    }
  } catch (error) {
    console.error('Error fetching previous revisions:', error)
    throw error
  }

  const { data: responseData } = previousRevisions

  // Find the requested revision for the provided concept
  const previousRevision = findPreviousRevision(responseData, revisionId)

  const { meta, umm } = previousRevision

  const { 'native-id': nativeId } = meta

  // Query CMR
  collection.ingest({
    nativeId,
    providerId: getProviderFromConceptId(conceptId),
    ...umm
  }, ingestKeys, headers)

  // Parse the response from CMR
  await collection.parseIngest(requestInfo)

  // Return a formatted JSON response
  return collection.getFormattedIngestResponse()
}

export const deleteCollection = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

  const {
    ingestKeys
  } = requestInfo

  const collection = new Collection(headers, requestInfo, args)

  // Query CMR
  collection.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await collection.parseDelete(requestInfo)

  // Return a formatted JSON response
  return collection.getFormattedDeleteResponse()
}
