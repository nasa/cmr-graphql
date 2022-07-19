import nock from 'nock'

import { downcaseKeys } from '../downcaseKeys'
import { cmrAccessLists } from '../cmrAccessLists'

describe('access control query', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV } //Saves the old Env vars

    process.env.cmrRootUrlTest = 'http://example.com' //Sets them to mocking values
  })

  afterEach(() => {
    process.env = OLD_ENV //reutrns the env variables in the terminal to original values 
  })

  test('Queries Access control List to retrive the list of access control lists with a supplied user token', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
    nock(/example/)
      .get(/acls/)
      .reply(200, { acls: [{
        "concept_id": "ACL1234",
        "revision_id": 1,
        "identity_type": "Catalog Item",
        "name": "aclName",
        "location": "http://something:0000/acls/ACL1111111111-CMR",
      }, {
        "concept_id": "ACL123334",
        "revision_id": 2,
        "identity_type": "Catalog Item",
        "name": "aclName",
        "location": "http://something:0000/acls/ACL0000000000-CMR",
        }
      ]
    }
  )
  // This is the fake return value
    const response = await cmrAccessLists({
      headers: { 'Authorization': 'test-token' }
    })

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = downcaseKeys(headers)
    console.log(data)
    expect(data).toEqual({
      acls: [{
        "concept_id": "ACL1234",
        "revision_id": 1,
        "identity_type": "Catalog Item",
        "name": "aclName",
        "location": "http://something:0000/acls/ACL1111111111-CMR",
      }, {
        "concept_id": "ACL123334",
        "revision_id": 2,
        "identity_type": "Catalog Item",
        "name": "aclName",
        "location": "http://something:0000/acls/ACL0000000000-CMR",
      }]
    })
  })
})