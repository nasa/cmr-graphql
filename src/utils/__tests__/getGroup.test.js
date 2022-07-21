import nock from 'nock'

import { downcaseKeys } from '../downcaseKeys'
import { getGroup } from '../getGroups'

describe('Tests for getGroup getting a specifc group from Access-control', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV } //Saves the old Env vars

    process.env.cmrRootUrlTest = 'http://example.com' //Sets them to mocking values
  })

  afterEach(() => {
    process.env = OLD_ENV //returns the env variables in the terminal to original values 
  })
  // Since we always have a call in the form of /acls/ACLXXXX this will intercept the getAcl call
  test('Queries A specific group', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
    nock(/example/)
      .get(/groups/)
      .reply(200, { group: {
        'name': 'prov1-group1',
        'description': 'the description of the group',
        'provider_id': 'PROV1',
      }
    }
  )
  // This is the fake return value
    const response = await getGroup({
      headers: { 'Authorization': 'test-token'},
      groupConceptId: 'AG100000000-PROV1'
    })

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = downcaseKeys(headers)
    console.log(data)
    expect(data).toEqual({
      group: {
        'name': 'prov1-group1',
        'description': 'the description of the group',
        'provider_id': 'PROV1',
      }
    })
  })

  describe('when an error is returned and getGroup errors out', () => {
    test('throws an exception', async () => {
      nock(/example/)
        .get(/groups/)
        .reply(500, {
          errors: ['HTTP Error']
        })
      const response = getGroup({
        headers: { 'Authorization': 'test-token' },
        groupConceptId: 'AG100000000-PROV1'
      })
      await expect(response).rejects.toThrow()
    })
  })
})