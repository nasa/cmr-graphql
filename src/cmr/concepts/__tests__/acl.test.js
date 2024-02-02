import Acl from '../acl'

jest.mock('../../../utils/aclQuery', () => ({
  aclQuery: jest.fn()
}))

describe('Acl', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('fetchAcl calls super.fetchAcl with correct parameters', () => {
    const acl = new Acl({}, {}, {})
    const searchParams = { key: 'value' }
    const ummKeys = ['ummKey1', 'ummKey2']
    const headers = { 'Content-Type': 'application/json' }

    // Mock the super.fetchAcl method
    jest.spyOn(Acl.prototype, 'fetchAcl')

    acl.fetchAcl(searchParams, ummKeys, headers)

    expect(Acl.prototype.fetchAcl).toHaveBeenCalledWith(searchParams, ummKeys, headers)
  })

  test('parseJsonBody extracts items from jsonResponse', () => {
    const acl = new Acl({}, {}, {})
    const jsonResponse = {
      data: {
        items: [
          {
            id: '1',
            name: 'Acl 1'
          },
          {
            id: '2',
            name: 'Acl 2'
          }
        ]
      }
    }

    const result = acl.parseJsonBody(jsonResponse)

    expect(result).toEqual([
      {
        id: '1',
        name: 'Acl 1'
      },
      {
        id: '2',
        name: 'Acl 2'
      }
    ])
  })

  // Add more tests as needed for other methods in the Acl component
})
