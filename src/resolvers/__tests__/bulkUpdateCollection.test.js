import nock from 'nock'

import { buildContextValue, server } from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('BulkUpdateCollection', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    test('bulkUpdateTasks', async () => {
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
                'update-field': 'SCIENCE_KEYWORDS'
              })
            }
          ]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          bulkUpdateTasks(params: { providerId: "MMT_2" }) {
            items {
              taskId
              name
              createdAt
              status
              statusMessage
              requestJsonBody
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        bulkUpdateTasks: {
          items: [
            {
              taskId: '3',
              name: 'TEST NAME1',
              createdAt: '2017-10-24T17:00:03.000Z',
              status: 'COMPLETE',
              statusMessage: 'All collection updates completed successfully.',
              requestJsonBody: {
                'concept-ids': ['C12807-MMT_2'],
                'update-type': 'FIND_AND_REMOVE',
                'update-field': 'SCIENCE_KEYWORDS'
              }
            }
          ]
        }
      })
    })

    test('bulkUpdateTask', async () => {
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
          'status-message': 'All collection updates completed successfully.',
          // CMR returns `request-json-body` as a JSON-encoded string, not a nested object
          'request-json-body': JSON.stringify({
            'concept-ids': ['C1200483944-MMT_2'],
            'update-type': 'FIND_AND_REMOVE',
            'update-field': 'SCIENCE_KEYWORDS'
          }),
          'collection-statuses': [
            {
              'concept-id': 'C1200483944-MMT_2',
              status: 'UPDATED'
            }
          ]
        })

      const response = await server.executeOperation({
        variables: {},
        query: `{
          bulkUpdateTask(params: { providerId: "MMT_2", taskId: "1641" }) {
            taskId
            name
            createdAt
            status
            statusMessage
            collectionStatuses {
              conceptId
              status
              statusMessage
            }
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        bulkUpdateTask: {
          taskId: '1641',
          name: 'TEST NAME',
          createdAt: '2017-10-24T17:00:03.000Z',
          status: 'COMPLETE',
          statusMessage: 'All collection updates completed successfully.',
          collectionStatuses: [
            {
              conceptId: 'C1200483944-MMT_2',
              status: 'UPDATED',
              statusMessage: null
            }
          ]
        }
      })
    })
  })

  describe('Mutation', () => {
    test('createBulkUpdateTask', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post('/ingest/providers/MMT_2/bulk-update/collections', {
          'concept-ids': ['C1200483944-MMT_2'],
          'update-type': 'FIND_AND_REMOVE',
          'update-field': 'SCIENCE_KEYWORDS',
          'find-value': { Category: 'EARTH SCIENCE' }
        })
        .reply(200, {
          'task-id': 1641
        })

      const response = await server.executeOperation({
        variables: {},
        query: `mutation {
          createBulkUpdateTask(
            providerId: "MMT_2",
            conceptIds: ["C1200483944-MMT_2"],
            updateType: FIND_AND_REMOVE,
            updateField: SCIENCE_KEYWORDS,
            findValue: { Category: "EARTH SCIENCE" }
          ) {
            taskId
          }
        }`
      }, {
        contextValue
      })

      const { data } = response.body.singleResult

      expect(data).toEqual({
        createBulkUpdateTask: {
          taskId: '1641'
        }
      })
    })
  })
})
