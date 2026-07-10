import { camelCase, get } from 'lodash'
import { parseRequestedFields } from '../utils/parseRequestedFields'

import draftKeyMap from '../utils/umm/draftKeyMap.json'

import Draft from '../cmr/concepts/draft'

import collectionKeyMap from '../utils/umm/collectionKeyMap.json'

const keyMapsByConceptType = {
  Collection: collectionKeyMap
}

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

  // Assign the formatted JSON response
  const response = draft.getFormattedResponse()

  // Dynamically apply keyMaps to previewMetadata which has been flattened into raw, camelcasedKeys in concept.js
  if (requestInfo.ummKeys.includes('previewMetadata')) {
    const targetKeyMap = keyMapsByConceptType[conceptType]

    if (targetKeyMap && targetKeyMap.ummKeyMappings) {
      const mapPreviewMetadata = (items) => items.map((item) => {
        if (!item.previewMetadata) return item
        console.log(item.previewMetadata)

        // Ensures previewMetadata always has conceptId for the resolver
        const mappedPreviewData = { conceptId: item.conceptId }

        // Iterate over the actual mappings inside the map file
        Object.keys(targetKeyMap.ummKeyMappings).forEach((graphQlKey) => {
          const jsonPath = targetKeyMap.ummKeyMappings[graphQlKey]

          // Split the path by dots [ 'umm', 'ProcessingLevel', 'Id' ]
          const pathParts = jsonPath.split('.')

          // Remove the 'umm' or 'meta' root prefix since Concept.js merged them
          pathParts.shift()

          // Convert the remaining path to match Concept.js's camelCased output
          // (['ProcessingLevel', 'Id'] -> "quality.summary")
          const camelCasedPath = pathParts.map((part) => camelCase(part)).join('.')

          // Fetch the value using lodash.get against the raw camelCased previewMetadata
          const value = get(item.previewMetadata, camelCasedPath)

          if (value !== undefined) {
            mappedPreviewData[graphQlKey] = value
          }
        })

        return {
          ...item,
          previewMetadata: mappedPreviewData
        }
      })

      if (requestInfo.isList) {
        return {
          ...response,
          items: mapPreviewMetadata(response.items || [])
        }
      }

      return mapPreviewMetadata(response || [])
    }
  }

  return response
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

export const publishDraft = async (args, context, parsedInfo) => {
  const { headers } = context

  const requestInfo = parseRequestedFields(parsedInfo, draftKeyMap, 'PublishDraft')

  const {
    ingestKeys
  } = requestInfo

  const draft = new Draft('Draft', headers, requestInfo, args)

  // Contact CMR
  draft.publish(args, ingestKeys, headers)

  // Parse the response from CMR
  await draft.parseIngest(requestInfo)

  // Return a formatted JSON response
  return draft.getFormattedIngestResponse()
}
