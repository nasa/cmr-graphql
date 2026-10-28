import { cmrIngest } from '../utils/cmrIngest'
import { mergeParams } from '../utils/mergeParams'
import { parseError } from '../utils/parseError'

const CONCEPT_TYPE = 'bulk-update/collections'

/**
 * Reject providerId values that are exactly `.` or `..`, which could otherwise
 * be interpreted as relative path segments when building the CMR ingest request path
 * @param {String} providerId The provider id supplied by the caller
 */
const assertValidProviderId = (providerId) => {
  if (providerId === '.' || providerId === '..') {
    throw new Error(`Invalid providerId: ${providerId}`)
  }
}

/**
 * Reject taskId values that are exactly `.` or `..`, which could otherwise
 * be interpreted as relative path segments when building the CMR ingest request path
 * @param {String} taskId The task id supplied by the caller
 */
const assertValidTaskId = (taskId) => {
  if (taskId === '.' || taskId === '..') {
    throw new Error(`Invalid taskId: ${taskId}`)
  }
}

/**
 * CMR returns `request-json-body` as a JSON-encoded string rather than a nested
 * object
 * @param {String} requestJsonBody The raw `request-json-body` value returned by CMR
 */
const parseRequestJsonBody = (requestJsonBody) => {
  if (typeof requestJsonBody !== 'string') return requestJsonBody

  try {
    return JSON.parse(requestJsonBody)
  } catch {
    return requestJsonBody
  }
}

/**
 * Formats a task summary returned from the bulk update status endpoint
 * @param {Object} task A task as returned by CMR
 */
const formatTask = (task) => {
  const {
    'created-at': createdAt,
    name,
    'request-json-body': requestJsonBody,
    status,
    'status-message': statusMessage,
    'task-id': taskId
  } = task

  return {
    createdAt,
    name,
    requestJsonBody: parseRequestJsonBody(requestJsonBody),
    status,
    statusMessage,
    taskId: taskId == null ? taskId : `${taskId}`
  }
}

/**
 * Formats an individual collection's status as part of a bulk update task
 * @param {Object} collectionStatus A collection status as returned by CMR
 */
const formatCollectionStatus = (collectionStatus) => {
  const {
    'concept-id': conceptId,
    status,
    'status-message': statusMessage
  } = collectionStatus

  return {
    conceptId,
    status,
    statusMessage
  }
}

/**
 * Retrieve the status of every collection bulk update task for a provider
 * @param {Object} args GraphQL query parameters
 * @param {Object} context GraphQL context object
 */
export const fetchBulkUpdateTasks = async (args, context) => {
  const { headers } = context

  const { providerId } = mergeParams(args)

  assertValidProviderId(providerId)

  try {
    const { data } = await cmrIngest({
      conceptType: CONCEPT_TYPE,
      headers,
      options: {
        method: 'GET',
        path: `ingest/providers/${encodeURIComponent(providerId)}/bulk-update/collections/status`
      }
    })

    const { tasks = [] } = data

    return {
      items: tasks.map(formatTask)
    }
  } catch (error) {
    return parseError(error, { reThrowError: true })
  }
}

/**
 * Retrieve the detailed status of a single collection bulk update task
 * @param {Object} args GraphQL query parameters
 * @param {Object} context GraphQL context object
 */
export const fetchBulkUpdateTask = async (args, context) => {
  const { headers } = context

  const { providerId, taskId } = mergeParams(args)

  assertValidProviderId(providerId)
  assertValidTaskId(taskId)

  try {
    const { data } = await cmrIngest({
      conceptType: CONCEPT_TYPE,
      headers,
      options: {
        method: 'GET',
        path: `ingest/providers/${encodeURIComponent(providerId)}/bulk-update/collections/status/${encodeURIComponent(taskId)}`
      }
    })

    const {
      'collection-statuses': collectionStatuses = [],
      'created-at': createdAt,
      name,
      'request-json-body': requestJsonBody,
      'status-message': statusMessage,
      'task-status': status
    } = data

    return {
      collectionStatuses: collectionStatuses.map(formatCollectionStatus),
      createdAt,
      name,
      requestJsonBody: parseRequestJsonBody(requestJsonBody),
      status,
      statusMessage,
      taskId
    }
  } catch (error) {
    return parseError(error, { reThrowError: true })
  }
}

/**
 * Initiate a bulk update of multiple collections belonging to a provider
 * @param {Object} args GraphQL mutation parameters
 * @param {Object} context GraphQL context object
 */
export const createBulkUpdateTask = async (args, context) => {
  const { headers } = context

  const {
    conceptIds,
    findValue,
    name,
    providerId,
    updateField,
    updateType,
    updateValue
  } = args

  const data = {
    'concept-ids': conceptIds,
    'update-field': updateField,
    'update-type': updateType
  }

  if (name) data.name = name
  if (findValue) data['find-value'] = findValue
  if (updateValue) data['update-value'] = updateValue

  assertValidProviderId(providerId)

  try {
    const { data: responseData } = await cmrIngest({
      conceptType: CONCEPT_TYPE,
      data,
      headers,
      options: {
        method: 'POST',
        path: `ingest/providers/${encodeURIComponent(providerId)}/bulk-update/collections`
      }
    })

    const { 'task-id': taskId } = responseData

    return {
      taskId: taskId == null ? taskId : `${taskId}`
    }
  } catch (error) {
    return parseError(error, { reThrowError: true })
  }
}
