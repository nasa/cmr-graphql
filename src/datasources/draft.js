import { parseRequestedFields } from '../utils/parseRequestedFields'

import draftKeyMap from '../utils/umm/draftKeyMap.json'

import Draft from '../cmr/concepts/draft'

export const fetchDrafts = async (args, context, parsedInfo) => {
  const { headers } = context

  const { params } = args
  const { conceptType } = params

  const draftType = `${conceptType.toLowerCase()}-drafts`

  const requestInfo = parseRequestedFields(parsedInfo, draftKeyMap, 'Draft')

  const draft = new Draft(draftType, headers, requestInfo, args)

  // Query CMR
  draft.fetch(args)

  // Parse the response from CMR
  await draft.parse(requestInfo)

  // Return a formatted JSON response
  return draft.getFormattedResponse()
}

export const ingestDraft = async (args, context, parsedInfo) => {
  const { headers } = context

  const { conceptType } = args

  const draftType = `${conceptType.toLowerCase()}-drafts`

  const requestInfo = parseRequestedFields(parsedInfo, draftKeyMap, 'Draft')

  const {
    ingestKeys
  } = requestInfo

  const draft = new Draft(draftType, headers, requestInfo, args)

  // Contact CMR
  draft.ingest(args, ingestKeys, headers)

  // Parse the response from CMR
  await draft.parseIngest(requestInfo)

  // Return a formatted JSON response
  return draft.getFormattedIngestResponse()
}

export const deleteDraft = async (args, context, parsedInfo) => {
  const { headers } = context

  const { conceptType } = args

  const draftType = `${conceptType.toLowerCase()}-drafts`

  const requestInfo = parseRequestedFields(parsedInfo, draftKeyMap, 'Draft')

  const {
    ingestKeys
  } = requestInfo

  const draft = new Draft(draftType, headers, requestInfo, args)

  // Contact CMR
  draft.delete(args, ingestKeys, headers)

  // Parse the response from CMR
  await draft.parseDelete(requestInfo)

  // Return a formatted JSON response
  return draft.getFormattedDeleteResponse()
}
