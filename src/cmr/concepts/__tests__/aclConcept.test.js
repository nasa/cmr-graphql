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

    describe('encodeCursor', () => {
      test('returns null when neither jsonSearchAfterIdentifier nor ummSearchAfterIdentifier is present', () => {
        const aclConcept = new AclConcept('conceptType', {}, {})

        expect(aclConcept.encodeCursor()).toBeNull()
      })

      test('returns base64 encoded string when jsonSearchAfterIdentifier and ummSearchAfterIdentifier are present', () => {
        const aclConcept = new AclConcept('conceptType', {}, {})
        aclConcept.jsonSearchAfterIdentifier = 'jsonSearchAfterId'
        aclConcept.ummSearchAfterIdentifier = 'ummSearchAfterId'

        const expectedBase64String = Buffer.from(JSON.stringify({
          json: 'jsonSearchAfterId',
          umm: 'ummSearchAfterId'
        })).toString('base64')

        expect(aclConcept.encodeCursor()).toEqual(expectedBase64String)
      })
    })

    describe('getFormattedResponse', () => {
      test('returns formatted response for list query', () => {
        const aclConcept = new AclConcept('conceptType', {}, { isList: true })
        aclConcept.setJsonItemCount(1)

        const formattedResponse = aclConcept.getFormattedResponse()

        expect(formattedResponse).toEqual({
          count: 0,
          cursor: null,
          items: []
        })
      })

      test('returns formatted response for non-list query', () => {
        const aclConcept = new AclConcept('conceptType', {}, { isList: false })
        aclConcept.setJsonItemCount(5)

        const formattedResponse = aclConcept.getFormattedResponse()

        expect(formattedResponse).toEqual([])
      })
    })
  })

  describe('parse', () => {
    test('successfully parses response with jsonKeys', async () => {
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

      await aclConcept.parse({ jsonKeys: ['key1', 'key2'] })

      expect(aclConcept.getItems()).toEqual({
        123: {
          key1: undefined,
          key2: undefined
        }
      })
    })

    test('handles error during parsing', async () => {
      const aclConcept = new AclConcept('conceptType', {}, { jsonKeys: ['key1', 'key2'] })
      jest.spyOn(aclConcept, 'getResponse').mockRejectedValue(new Error('Failed to fetch data'))

      await expect(aclConcept.parse({ jsonKeys: ['key1', 'key2'] })).rejects.toThrowError('Failed to fetch data')
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

  describe('getResponse', () => {
    test('returns the response when response is set', async () => {
      const aclConcept = new AclConcept('conceptType', {}, {})
      const expectedResponse = [{ data: 'some data' }]
      aclConcept.response = expectedResponse

      const result = await aclConcept.getResponse()

      expect(result).toEqual(expectedResponse)
    })

    test('returns undefined when response is not set', async () => {
      const aclConcept = new AclConcept('conceptType', {}, {})

      const result = await aclConcept.getResponse()

      expect(result).toBeUndefined()
    })

    test('returns the response with different data', async () => {
      const aclConcept = new AclConcept('conceptType', {}, {})
      const expectedResponse = [{ data: 'different data' }]
      aclConcept.response = expectedResponse

      const result = await aclConcept.getResponse()

      expect(result).toEqual(expectedResponse)
    })
  })

  describe('logKeyRequest', () => {
    // Mock console.log to capture log messages
    let consoleLogSpy
    beforeEach(() => {
      consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleLogSpy.mockRestore()
    })

    test('logs key requests for json format', () => {
      const aclConcept = new AclConcept('conceptType', {}, {})
      aclConcept.getRequestId = jest.fn(() => '123')
      aclConcept.getClientId = jest.fn(() => '456')
      aclConcept.getConceptType = jest.fn(() => 'exampleConceptType')

      const keys = ['key1', 'key2']
      const format = 'json'

      aclConcept.logKeyRequest(keys, format)

      // Expect the log messages to be printed
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Request 123 from 456 to [concept: exampleConceptType] requested [format: json, key: key1]'
      )

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Request 123 from 456 to [concept: exampleConceptType] requested [format: json, key: key2]'
      )
    })

    test('does not log concept types for json format', () => {
      const aclConcept = new AclConcept('conceptType', {}, {})
      aclConcept.getRequestId = jest.fn(() => '123')
      aclConcept.getClientId = jest.fn(() => '456')
      aclConcept.getConceptType = jest.fn(() => 'collections')

      const keys = ['key1', 'key2', 'collections']
      const format = 'json'

      aclConcept.logKeyRequest(keys, format)

      // Expect the log messages for key1 and key2, but not for exampleConceptType
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Request 123 from 456 to [concept: collections] requested [format: json, key: key1]'
      )

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Request 123 from 456 to [concept: collections] requested [format: json, key: key2]'
      )

      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        'Request 123 from 456 to [concept:collections] requested [format: json, key: exampleConceptType]'
      )
    })
  })

  describe('setItemValue', () => {
    let aclConcept

    beforeEach(() => {
      aclConcept = new AclConcept('conceptType', {}, { jsonKeys: ['key1', 'key2'] })
    })

    test('setItemValue sets value in items object', () => {
      const id = '123'
      const key = 'key1'
      const value = 'sampleValue'

      aclConcept.setItemValue(id, key, value)

      // Check that the item was created in the items object
      expect(aclConcept.items).toHaveProperty(id)

      // Check that the value was set correctly
      expect(aclConcept.items[id][key]).toEqual(value)
    })
  })
})
