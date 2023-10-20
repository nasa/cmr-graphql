import { DRAFT_CONCEPT_ID_PREFIXES } from '../constants'

/**
 * Test if the provided concept ID is a draft
 * @param {String} conceptId Concept ID to test
 * @param {String} type Type of concept to check
 */
export const isDraftConceptId = (conceptId, type) => (
  conceptId.startsWith(DRAFT_CONCEPT_ID_PREFIXES[type])
)
