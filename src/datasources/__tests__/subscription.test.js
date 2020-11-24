import nock from 'nock'

import subscriptionDatasource from '../subscription'

let requestInfo

describe('subscription', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'

    // Default requestInfo
    requestInfo = {
      name: 'subscriptions',
      alias: 'subscriptions',
      args: {},
      fieldsByTypeName: {
        SubscriptionList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Subscription: {
                conceptId: {
                  name: 'conceptId',
                  alias: 'conceptId',
                  args: {},
                  fieldsByTypeName: {}
                }
              }
            }
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('cursor', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'subscriptions',
        alias: 'subscriptions',
        args: {},
        fieldsByTypeName: {
          SubscriptionList: {
            cursor: {
              name: 'cursor',
              alias: 'cursor',
              args: {},
              fieldsByTypeName: {}
            },
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Subscription: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  emailAddress: {
                    name: 'emailAddress',
                    alias: 'emailAddress',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns a cursor', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Scroll-Id': '-98726357'
        })
        .post(/subscriptions\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'SUB100000-EDSC'
            },
            umm: {
              EmailAddress: 'test@example.com'
            }
          }]
        })

      const response = await subscriptionDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'subscription')

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiItOTg3MjYzNTcifQ==',
        items: [{
          conceptId: 'SUB100000-EDSC',
          emailAddress: 'test@example.com'
        }]
      })
    })

    describe('when a cursor is requested', () => {
      test('requests a cursor', async () => {
        nock(/example/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Scroll-Id': '-98726357'
          })
          .post(/subscriptions\.umm_json/, 'scroll=true')
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'SUB100000-EDSC'
              },
              umm: {
                EmailAddress: 'test@example.com'
              }
            }]
          })

        const response = await subscriptionDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'collection')

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiItOTg3MjYzNTcifQ==',
          items: [{
            conceptId: 'SUB100000-EDSC',
            emailAddress: 'test@example.com'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed subscription results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/subscriptions\.json/)
        .reply(200, {
          items: [{
            concept_id: 'SUB100000-EDSC'
          }]
        })

      const response = await subscriptionDatasource({}, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'subscription')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'SUB100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed subscription results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/subscriptions\.json/, 'concept_id=SUB100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'SUB100000-EDSC'
          }]
        })

      const response = await subscriptionDatasource({ concept_id: 'SUB100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'subscription')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          conceptId: 'SUB100000-EDSC'
        }]
      })
    })
  })

  describe('with json and umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'subscriptions',
        alias: 'subscriptions',
        args: {},
        fieldsByTypeName: {
          ToolList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Tool: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  emailAddress: {
                    name: 'emailAddress',
                    alias: 'emailAddress',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'subscriptions',
        alias: 'subscriptions',
        args: {},
        fieldsByTypeName: {
          SubscriptionList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Subscription: {
                  emailAddress: {
                    name: 'emailAddress',
                    alias: 'emailAddress',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns the parsed subscription results', async () => {
      nock(/example/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .post(/subscriptions\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'SUB100000-EDSC'
            },
            umm: {
              EmailAddress: 'test@example.com'
            }
          }]
        })

      const response = await subscriptionDatasource({ concept_id: 'SUB100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'subscription')

      expect(response).toEqual({
        count: 84,
        cursor: 'e30=',
        items: [{
          emailAddress: 'test@example.com'
        }]
      })
    })
  })

  test('catches errors received from queryCmrSubscriptions', async () => {
    nock(/example/)
      .post(/subscriptions/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      subscriptionDatasource({ conceptId: 'SUB100000-EDSC' }, { 'CMR-Request-Id': 'abcd-1234-efgh-5678' }, requestInfo, 'subscription')
    ).rejects.toThrow(Error)
  })
})
