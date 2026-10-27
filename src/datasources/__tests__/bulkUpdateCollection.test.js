import nock from 'nock'

import {
  createBulkUpdateTask,
  fetchBulkUpdateTask,
  fetchBulkUpdateTasks
} from '../bulkUpdateCollection'

const context = {
  headers: {
    'Client-Id': 'eed-test-graphql',
    'CMR-Request-Id': 'abcd-1234-efgh-5678'
  }
}

describe('bulkUpdateCollection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('fetchBulkUpdateTasks', () => {
    describe('when the request is successful', () => {
      test('returns the list of tasks', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/ingest/providers/MMT_2/bulk-update/collections/status')
          .reply(200, {
            tasks: [
              {
                'created-at': '2017-10-24T17:00:03.000Z',
                name: 'TEST NAME1',
                'task-id': 3,
                status: 'COMPLETE',
                'status-message': 'All collection updates completed successfully.',
                // CMR returns `request-json-body` as a JSON-encoded string, not a nested object
                'request-json-body': JSON.stringify({
                  'concept-ids': ['C12807-MMT_2'],
                  'update-type': 'FIND_AND_REMOVE',
                  'update-field': 'SCIENCE_KEYWORDS',
                  'find-value': { Category: 'EARTH SCIENCE' }
                })
              }
            ]
          })

        const response = await fetchBulkUpdateTasks({
          params: {
            providerId: 'MMT_2'
          }
        }, context)

        expect(response).toEqual({
          items: [
            {
              createdAt: '2017-10-24T17:00:03.000Z',
              name: 'TEST NAME1',
              requestJsonBody: {
                'concept-ids': ['C12807-MMT_2'],
                'update-type': 'FIND_AND_REMOVE',
                'update-field': 'SCIENCE_KEYWORDS',
                'find-value': { Category: 'EARTH SCIENCE' }
              },
              status: 'COMPLETE',
              statusMessage: 'All collection updates completed successfully.',
              taskId: '3'
            }
          ]
        })
      })
    })

    describe('when the request fails', () => {
      test('throws an error', async () => {
        nock(/example-cmr/)
          .get('/ingest/providers/MMT_2/bulk-update/collections/status')
          .reply(500, {
            errors: ['HTTP Error']
          }, {
            'cmr-request-id': 'abcd-1234-efgh-5678'
          })

        await expect(
          fetchBulkUpdateTasks({
            params: {
              providerId: 'MMT_2'
            }
          }, context)
        ).rejects.toThrow(Error)
      })
    })

    describe('when the response does not include tasks', () => {
      test('defaults items to an empty array', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/ingest/providers/MMT_2/bulk-update/collections/status')
          .reply(200, {})

        const response = await fetchBulkUpdateTasks({
          params: {
            providerId: 'MMT_2'
          }
        }, context)

        expect(response).toEqual({
          items: []
        })
      })
    })

    describe('when a task has no task-id', () => {
      test('leaves taskId as-is instead of stringifying it', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/ingest/providers/MMT_2/bulk-update/collections/status')
          .reply(200, {
            tasks: [
              {
                'created-at': '2017-10-24T17:00:03.000Z',
                name: 'TEST NAME1',
                status: 'COMPLETE',
                'status-message': 'All collection updates completed successfully.'
              }
            ]
          })

        const response = await fetchBulkUpdateTasks({
          params: {
            providerId: 'MMT_2'
          }
        }, context)

        expect(response).toEqual({
          items: [
            {
              createdAt: '2017-10-24T17:00:03.000Z',
              name: 'TEST NAME1',
              requestJsonBody: undefined,
              status: 'COMPLETE',
              statusMessage: 'All collection updates completed successfully.',
              taskId: undefined
            }
          ]
        })
      })
    })

    describe('when request-json-body is not valid JSON', () => {
      test('returns the raw string unchanged', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/ingest/providers/MMT_2/bulk-update/collections/status')
          .reply(200, {
            tasks: [
              {
                'created-at': '2017-10-24T17:00:03.000Z',
                name: 'TEST NAME1',
                'task-id': 3,
                status: 'COMPLETE',
                'status-message': 'All collection updates completed successfully.',
                'request-json-body': 'not valid json'
              }
            ]
          })

        const response = await fetchBulkUpdateTasks({
          params: {
            providerId: 'MMT_2'
          }
        }, context)

        expect(response).toEqual({
          items: [
            {
              createdAt: '2017-10-24T17:00:03.000Z',
              name: 'TEST NAME1',
              requestJsonBody: 'not valid json',
              status: 'COMPLETE',
              statusMessage: 'All collection updates completed successfully.',
              taskId: '3'
            }
          ]
        })
      })
    })
  })

  describe('fetchBulkUpdateTask', () => {
    describe('when the request is successful', () => {
      test('returns the detailed task status', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/ingest/providers/MMT_2/bulk-update/collections/status/1641')
          .reply(200, {
            'created-at': '2017-10-24T17:00:03.000Z',
            name: 'TEST NAME',
            'task-status': 'COMPLETE',
            'status-message': 'Task completed with 1 FAILED and 1 UPDATED out of 2 total collection update(s).',
            // CMR returns `request-json-body` as a JSON-encoded string, not a nested object
            'request-json-body': JSON.stringify({
              'concept-ids': ['C1200483944-MMT_2', 'C1200484122-MMT_2'],
              'update-type': 'FIND_AND_REMOVE',
              'update-field': 'SCIENCE_KEYWORDS',
              'find-value': { Category: 'EARTH SCIENCE' }
            }),
            'collection-statuses': [
              {
                'concept-id': 'C1200483944-MMT_2',
                status: 'UPDATED'
              },
              {
                'concept-id': 'C1200484122-MMT_2',
                status: 'FAILED',
                'status-message': 'Validation error'
              }
            ]
          })

        const response = await fetchBulkUpdateTask({
          params: {
            providerId: 'MMT_2',
            taskId: '1641'
          }
        }, context)

        expect(response).toEqual({
          taskId: '1641',
          name: 'TEST NAME',
          createdAt: '2017-10-24T17:00:03.000Z',
          status: 'COMPLETE',
          statusMessage: 'Task completed with 1 FAILED and 1 UPDATED out of 2 total collection update(s).',
          requestJsonBody: {
            'concept-ids': ['C1200483944-MMT_2', 'C1200484122-MMT_2'],
            'update-type': 'FIND_AND_REMOVE',
            'update-field': 'SCIENCE_KEYWORDS',
            'find-value': { Category: 'EARTH SCIENCE' }
          },
          collectionStatuses: [
            {
              conceptId: 'C1200483944-MMT_2',
              status: 'UPDATED',
              statusMessage: undefined
            },
            {
              conceptId: 'C1200484122-MMT_2',
              status: 'FAILED',
              statusMessage: 'Validation error'
            }
          ]
        })
      })
    })

    describe('when the request fails', () => {
      test('throws an error', async () => {
        nock(/example-cmr/)
          .get('/ingest/providers/MMT_2/bulk-update/collections/status/1641')
          .reply(500, {
            errors: ['HTTP Error']
          }, {
            'cmr-request-id': 'abcd-1234-efgh-5678'
          })

        await expect(
          fetchBulkUpdateTask({
            params: {
              providerId: 'MMT_2',
              taskId: '1641'
            }
          }, context)
        ).rejects.toThrow(Error)
      })
    })

    describe('when collection-statuses is not included in the response', () => {
      test('defaults collectionStatuses to an empty array', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .get('/ingest/providers/MMT_2/bulk-update/collections/status/1641')
          .reply(200, {
            'created-at': '2017-10-24T17:00:03.000Z',
            name: 'TEST NAME',
            'task-status': 'IN_PROGRESS',
            'status-message': 'Task is still in progress.'
          })

        const response = await fetchBulkUpdateTask({
          params: {
            providerId: 'MMT_2',
            taskId: '1641'
          }
        }, context)

        expect(response).toEqual({
          taskId: '1641',
          name: 'TEST NAME',
          createdAt: '2017-10-24T17:00:03.000Z',
          status: 'IN_PROGRESS',
          statusMessage: 'Task is still in progress.',
          requestJsonBody: undefined,
          collectionStatuses: []
        })
      })
    })
  })

  describe('createBulkUpdateTask', () => {
    describe('when the request is successful', () => {
      test('removing a science keyword returns the new task id', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post('/ingest/providers/MMT_2/bulk-update/collections', {
            'concept-ids': ['C1200483944-MMT_2', 'C1200484122-MMT_2'],
            'update-type': 'FIND_AND_REMOVE',
            'update-field': 'SCIENCE_KEYWORDS',
            'find-value': {
              Category: 'EARTH SCIENCE',
              Topic: 'AGRICULTURE',
              Term: 'AGRICULTURAL AQUATIC SCIENCES',
              VariableLevel1: 'AQUACULTURE'
            }
          })
          .reply(200, {
            'task-id': 1641
          })

        const response = await createBulkUpdateTask({
          providerId: 'MMT_2',
          conceptIds: ['C1200483944-MMT_2', 'C1200484122-MMT_2'],
          updateType: 'FIND_AND_REMOVE',
          updateField: 'SCIENCE_KEYWORDS',
          findValue: {
            Category: 'EARTH SCIENCE',
            Topic: 'AGRICULTURE',
            Term: 'AGRICULTURAL AQUATIC SCIENCES',
            VariableLevel1: 'AQUACULTURE'
          }
        }, context)

        expect(response).toEqual({
          taskId: '1641'
        })
      })

      test('adding a science keyword back with a name returns the new task id', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          })
          .post('/ingest/providers/MMT_2/bulk-update/collections', {
            'concept-ids': ['C1200483944-MMT_2', 'C1200484122-MMT_2'],
            name: 'Add back aquaculture keyword',
            'update-type': 'ADD_TO_EXISTING',
            'update-field': 'SCIENCE_KEYWORDS',
            'update-value': {
              Category: 'EARTH SCIENCE',
              Topic: 'AGRICULTURE',
              Term: 'AGRICULTURAL AQUATIC SCIENCES',
              VariableLevel1: 'AQUACULTURE'
            }
          })
          .reply(200, {
            'task-id': 1642
          })

        const response = await createBulkUpdateTask({
          providerId: 'MMT_2',
          conceptIds: ['C1200483944-MMT_2', 'C1200484122-MMT_2'],
          name: 'Add back aquaculture keyword',
          updateType: 'ADD_TO_EXISTING',
          updateField: 'SCIENCE_KEYWORDS',
          updateValue: {
            Category: 'EARTH SCIENCE',
            Topic: 'AGRICULTURE',
            Term: 'AGRICULTURAL AQUATIC SCIENCES',
            VariableLevel1: 'AQUACULTURE'
          }
        }, context)

        expect(response).toEqual({
          taskId: '1642'
        })
      })
    })

    test('when the response has no task-id, leaves taskId as-is instead of stringifying it', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post('/ingest/providers/MMT_2/bulk-update/collections')
        .reply(200, {})

      const response = await createBulkUpdateTask({
        providerId: 'MMT_2',
        conceptIds: ['C1200483944-MMT_2'],
        updateType: 'FIND_AND_REMOVE',
        updateField: 'SCIENCE_KEYWORDS',
        findValue: { Category: 'EARTH SCIENCE' }
      }, context)

      expect(response).toEqual({
        taskId: undefined
      })
    })

    describe('when the request fails', () => {
      test('throws an error', async () => {
        nock(/example-cmr/)
          .post('/ingest/providers/MMT_2/bulk-update/collections')
          .reply(400, {
            errors: ['Invalid bulk update request']
          }, {
            'cmr-request-id': 'abcd-1234-efgh-5678'
          })

        await expect(
          createBulkUpdateTask({
            providerId: 'MMT_2',
            conceptIds: ['C1200483944-MMT_2'],
            updateType: 'FIND_AND_REMOVE',
            updateField: 'SCIENCE_KEYWORDS',
            findValue: { Category: 'EARTH SCIENCE' }
          }, context)
        ).rejects.toThrow(Error)
      })
    })
  })
})
