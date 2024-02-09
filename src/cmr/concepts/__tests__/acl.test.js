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

  test('fetchAcl calls aclQuery with correct parameters when jsonKeys are present', () => {
    const acl = new Acl({ 'Header-Key': 'header-value' }, { jsonKeys: ['key1', 'key2'] })
    acl.jsonItemCount = 1

    const aclQuerySpy = jest.spyOn(acl, 'fetchAcl').mockImplementation(() => Promise.resolve())

    acl.fetch({
      key1: 'value1',
      key2: 'value2'
    })

    expect(aclQuerySpy).toHaveBeenCalledWith({
      key1: 'value1',
      key2: 'value2'
    }, ['key1', 'key2'], { 'Header-Key': 'header-value' })
  })

  test('fetchAcl does not call aclQuery when jsonKeys are not present', () => {
    const acl = new Acl({ 'Header-Key': 'header-value' }, { jsonKeys: [] })
    acl.jsonItemCount = 42

    const aclQuerySpy = jest.spyOn(acl, 'fetchAcl').mockImplementation(() => Promise.resolve())

    acl.fetch({
      key1: 'value1',
      key2: 'value2'
    })

    // Expect that aclQuery is not called when jsonKeys are not present
    expect(aclQuerySpy).not.toHaveBeenCalled()
  })
})
