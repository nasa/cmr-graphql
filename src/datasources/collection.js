import { cmrQuery } from '../utils/cmrQuery'
import { getProviderFromConceptId } from '../utils/getProviderFromConceptId'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

import Collection from '../cmr/concepts/collection'
import { findPreviousRevision } from '../utils/findPreviousRevision'

export const fetchCollections = async (params, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, collectionKeyMap, 'collection')

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

  // First attempt: without Authorization
  try {
    previousRevisions = await cmrQuery({
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
      // Second attempt: with Authorization
      previousRevisions = await cmrQuery({
        headers: {
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
    }

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
