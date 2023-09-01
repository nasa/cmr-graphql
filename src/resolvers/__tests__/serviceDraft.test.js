import nock from 'nock'

import {
  buildContextValue,
  server
} from './__mocks__/mockServer'

const contextValue = buildContextValue()

describe('ServiceDraft', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.mmtRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Query', () => {
    describe('serviceDraft', () => {
      describe('with result', () => {
        test('all service draft fields', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/api\/service_drafts/)
            .reply(200, {
              draft: {
                AccessConstraints: 'Mock Access Constraints',
                AncillaryKeywords: [],
                ContactGroups: {},
                ContactPersons: {},
                Description: 'Mock Description',
                LastUpdatedDate: 'Mock Last Updated Date',
                LongName: 'Mock Long Name',
                Name: 'Mock Name',
                OperationMetadata: {},
                RelatedURLs: {},
                ServiceKeywords: [],
                ServiceOptions: {},
                ServiceOrganizations: {},
                ServiceQuality: {},
                Type: 'Mock Type',
                URL: {},
                UseConstraints: {},
                Version: '1.0',
                VersionDescription: 'Mock Version Description'
              }
            })
          const response = await server.executeOperation({
            variables: {},
            query: `{
              serviceDraft (params: { id: 123 }) {
                accessConstraints
                ancillaryKeywords
                contactGroups
                contactPersons
                description
                lastUpdatedDate
                longName
                name
                operationMetadata
                relatedUrls
                serviceKeywords
                serviceOptions
                serviceOrganizations
                serviceQuality
                type
                url
                useConstraints
                version
                versionDescription
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            serviceDraft: {
              accessConstraints: 'Mock Access Constraints',
              ancillaryKeywords: [],
              contactGroups: {},
              contactPersons: {},
              description: 'Mock Description',
              lastUpdatedDate: 'Mock Last Updated Date',
              longName: 'Mock Long Name',
              name: 'Mock Name',
              operationMetadata: {},
              relatedUrls: {},
              serviceKeywords: [],
              serviceOptions: {},
              serviceOrganizations: {},
              serviceQuality: {},
              type: 'Mock Type',
              url: {},
              useConstraints: {},
              version: '1.0',
              versionDescription: 'Mock Version Description'
            }
          })
        })
        test('return results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/api\/service_drafts/)
            .reply(200, {
              draft: {
                Name: 'Mock Name'
              }
            })
          const response = await server.executeOperation({
            variables: {},
            query: `{
                serviceDraft (params: { id: 123 }) {
                  name
                }
              }`
          }, {
            contextValue
          })
          const { data } = response.body.singleResult
          expect(data).toEqual({
            serviceDraft: {
              name: 'Mock Name'
            }
          })
        })
      })

      describe('with no results', () => {
        test('return no results', async () => {
          nock(/example/)
            .defaultReplyHeaders({
              'X-Request-Id': 'abcd-1234-efgh-5678'
            })
            .get(/api\/service_drafts/)
            .reply(200, {})
          const response = await server.executeOperation({
            variables: {},
            query: `{
              serviceDraft (params: { id: 123 }) {
                name
              }
            }`
          }, {
            contextValue
          })

          const { data } = response.body.singleResult

          expect(data).toEqual({
            serviceDraft: {
              name: null
            }
          })
        })
      })
    })
  })
})
