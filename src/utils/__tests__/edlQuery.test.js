import nock from 'nock'

import { edlQuery } from '../edlQuery'

describe('edlQuery', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.edlRootUrl = 'http://edl.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('queries edl', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    nock(/edl/, {
      reqheaders: {
        Authorization: 'test-token'
      }
    })
      .get('/api/users/testuser')
      .reply(200, {
        uid: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        email_address: 'testuser@example.com',
        registered_date: '2 Oct 2018 02:31:32AM',
        country: 'United States',
        study_area: 'Other',
        allow_auth_app_emails: 'ru',
        user_type: 'Application',
        affiliation: 'Something',
        organization: 'NASA',
        user_groups: '',
        user_authorized_apps: '',
        nams_auid: 'testuser'
      })

    const response = await edlQuery(
      'testuser',
      { Authorization: 'test-token' }
    )

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = headers

    expect(data).toEqual({
      uid: 'testuser',
      first_name: 'Test',
      last_name: 'User',
      email_address: 'testuser@example.com',
      registered_date: '2 Oct 2018 02:31:32AM',
      country: 'United States',
      study_area: 'Other',
      allow_auth_app_emails: 'ru',
      user_type: 'Application',
      affiliation: 'Something',
      organization: 'NASA',
      user_groups: '',
      user_authorized_apps: '',
      nams_auid: 'testuser'
    })

    expect(consoleMock).toBeCalledWith(
      `Request to EDL completed in ${requestDuration} ms`
    )
  })

  describe('when an error is returned', () => {
    test('throws an exception', async () => {
      nock(/edl/, {
        reqheaders: {
          Authorization: 'bad-token'
        }
      })
        .get('/api/users/testuser')
        .reply(401, {
          error: 'invalid_token'
        })

      const response = edlQuery(
        'testuser',
        { Authorization: 'bad-token' }
      )

      await expect(response).rejects.toThrow()
    })
  })
})
