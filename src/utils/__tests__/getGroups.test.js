import nock from 'nock'

import { downcaseKeys } from '../downcaseKeys'
import { getGroups } from '../getGroups'

describe('Tests for getGroups getting all groups with a user-supplied-token from Access-control', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV } //Saves the old Env vars

    process.env.cmrRootUrlTest = 'http://example.com' //Sets them to mocking values
  })

  afterEach(() => {
    process.env = OLD_ENV //reutrns the env variables in the terminal to original values 
  })

  test('Queries Access control List', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
    nock(/example/)
      .get(/groups/)
      .reply(200, { groups: [{
        "concept_id": "AG100000000-PROV1",
        "provider_id": "PROV1",
        "member_count": 1,
        "name": "groupName",
        "description": "descripion of the group",
        "revision_id": 1,
      }, {
        "concept_id": "AG100000000-PROV1",
        "provider_id": "PROV1",
        "member_count": 2,
        "name": "groupName2",
        "description": "descripion of this other group",
        "revision_id": 2,
        }
      ]
    }
  )
  // This is the fake return value
    const response = await getGroups({
      headers: { 'Authorization': 'test-token' }
    })

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = downcaseKeys(headers)
    console.log(data)
    expect(data).toEqual({
      groups: [{
        "concept_id": "AG100000000-PROV1",
        "provider_id": "PROV1",
        "member_count": 1,
        "name": "groupName",
        "description": "descripion of the group",
        "revision_id": 1,
      }, {
        "concept_id": "AG100000000-PROV1",
        "provider_id": "PROV1",
        "member_count": 2,
        "name": "groupName2",
        "description": "descripion of this other group",
        "revision_id": 2,
        }
      ]
    })
  })
  
  describe('when an error is returned and getAcls errors out', () => {
    test('throws an exception', async () => {
      nock(/example/)
        .get(/groups/)
        .reply(500, {
          errors: ['HTTP Error']
        })
      const response = getGroups({
        headers: { 'Authorization': 'test-token' }
      })
      await expect(response).rejects.toThrow()
    })
  })
})