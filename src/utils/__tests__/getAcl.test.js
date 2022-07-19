import nock from 'nock'

import { downcaseKeys } from '../downcaseKeys'
import { getAcl } from '../cmrAccessLists'

describe('Tests getting a particular access control list', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV } //Saves the old Env vars

    process.env.cmrRootUrlTest = 'http://example.com' //Sets them to mocking values
  })

  afterEach(() => {
    process.env = OLD_ENV //returns the env variables in the terminal to original values 
  })
  // Since we always have a call in the form of /acls/ACLXXXX this will intercept the getAcl call
  test('Tests getting a particular access control list from Access control by supplying it a concept-id', async () => {
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())
    nock(/example/)
      .get(/acls/)
      .reply(200, { acl: {
        'group_permissions': [{
          'group_id' : 'AG0000-PROV',
          'permissions': ['read','order']
        }],
        'catalog_item_Identity': [{
        'collection_applicable': 'true',
        'collection_identifier':[{
          'concept_ids': ['Collection1','Collection2'],
          'entry_titles': ['col1Entrytitle','col2Entrytitle']  
        }]
        }]
      }
    }
  )
  // This is the fake return value
    const response = await getAcl({
      headers: { 'Authorization': 'test-token'},
      aclUrl: 'aclUrl'
    })

    const { data, headers } = response

    const {
      'request-duration': requestDuration
    } = downcaseKeys(headers)
    console.log(data)
    expect(data).toEqual({ acl: {
      'group_permissions': [{
        'group_id' : 'AG0000-PROV',
        'permissions': ['read','order']
      }],
      'catalog_item_Identity': [{
      'collection_applicable': 'true',
      'collection_identifier': [{
        'concept_ids': ['Collection1','Collection2'],
        'entry_titles' : ['col1Entrytitle','col2Entrytitle']  
      }]
      }]
    }
  })
  })
})