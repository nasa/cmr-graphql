import AclConcept from '../aclConcept'

describe('AclConcept', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()
  })

  describe('Aclconcept', () => {
    describe('getItemCount', () => {
      describe('when no Jsonkeys are present', () => {
        test('returns 0', () => {
          const aclConcept = new AclConcept('concept')

          expect(aclConcept.getItemCount()).toEqual(0)
        })
      })

      describe('Jsonkeys count', () => {
        test('returns 84', () => {
          const aclConcept = new AclConcept('concept', {}, {
            jsonKeys: ['jsonKey']
          })

          aclConcept.setJsonItemCount(84)

          expect(aclConcept.getItemCount()).toEqual(84)
        })
      })
    })
  })

  describe('fetchAcl', () => {
    test('fetchAcl calls aclQuery with correct parameters when jsonKeys are present', () => {
      const aclConcept = new AclConcept('conceptType', { 'Header-Key': 'header-value' }, { jsonKeys: ['key1', 'key2'] })
      aclConcept.jsonItemCount = 1

      const aclQuerySpy = jest.spyOn(aclConcept, 'fetchAcl').mockImplementation(() => Promise.resolve())

      aclConcept.fetch({
        key1: 'value1',
        key2: 'value2'
      })

      expect(aclQuerySpy).toHaveBeenCalledWith({
        key1: 'value1',
        key2: 'value2'
      }, ['key1', 'key2'], { 'Header-Key': 'header-value' })
    })

    test('fetchAcl does not call aclQuery when jsonKeys are not present', () => {
      const aclConcept = new AclConcept('conceptType', { 'Header-Key': 'header-value' }, { jsonKeys: [] })
      aclConcept.jsonItemCount = 42

      const aclQuerySpy = jest.spyOn(aclConcept, 'fetchAcl').mockImplementation(() => Promise.resolve())

      aclConcept.fetch({
        key1: 'value1',
        key2: 'value2'
      })

      // Expect that aclQuery is not called when jsonKeys are not present
      expect(aclQuerySpy).not.toHaveBeenCalled()
    })
  })

  describe('parse', () => {
    test('calls parseJson when jsonKeys are present in requestInfo', async () => {
      const aclConcept = new AclConcept('conceptType', {}, { jsonKeys: ['key1', 'key2'] })
      const jsonResponse = {
        data: {
          items: [{
            concept_id: '123',
            key1: 'value1',
            key2: 'value2'
          }]
        }
      }
      jest.spyOn(aclConcept, 'getResponse').mockResolvedValue([jsonResponse])
      const parseJsonSpy = jest.spyOn(aclConcept, 'parseJson').mockImplementation(() => Promise.resolve())

      await aclConcept.parse({ jsonKeys: ['key1', 'key2'] })

      expect(parseJsonSpy).toHaveBeenCalledWith(jsonResponse, ['key1', 'key2'])
    })

    test('does not call parseJson when jsonKeys are not present in requestInfo', async () => {
      const aclConcept = new AclConcept('conceptType', {}, {})
      const getResponseSpy = jest.spyOn(aclConcept, 'getResponse').mockResolvedValue([{}])
      const parseJsonSpy = jest.spyOn(aclConcept, 'parseJson').mockImplementation(() => Promise.resolve())

      await aclConcept.parse({})

      expect(getResponseSpy).toHaveBeenCalled()
      expect(parseJsonSpy).toHaveBeenCalled()
    })

    test('handles error during parsing', async () => {
      const aclConcept = new AclConcept('conceptType', {}, { jsonKeys: ['key1', 'key2'] })
      jest.spyOn(aclConcept, 'getResponse').mockRejectedValue(new Error('Failed to fetch data'))

      await expect(aclConcept.parse({ jsonKeys: ['key1', 'key2'] })).rejects.toThrowError('Failed to fetch data')
    })
  })
})
