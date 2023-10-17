import Draft from '../draft'

describe('Draft concept', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Draft concept', () => {
    describe('constructor', () => {
      describe('when the conceptType is collection-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('collection-drafts', {}, {}, {
            providerId: 'EDSC',
            ummVersion: '1.0.0'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/collection-drafts')
          expect(draft.metadataSpecification).toEqual({
            Name: 'collection-draft',
            URL: 'https://cdn.earthdata.nasa.gov/umm/collection-draft/v1.0.0',
            Version: '1.0.0'
          })
        })
      })

      describe('when the conceptType is service-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('service-drafts', {}, {}, {
            providerId: 'EDSC',
            ummVersion: '1.0.0'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/service-drafts')
          expect(draft.metadataSpecification).toEqual({
            Name: 'service-draft',
            URL: 'https://cdn.earthdata.nasa.gov/umm/service-draft/v1.0.0',
            Version: '1.0.0'
          })
        })
      })

      describe('when the conceptType is tool-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('tool-drafts', {}, {}, {
            providerId: 'EDSC',
            ummVersion: '1.0.0'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/tool-drafts')
          expect(draft.metadataSpecification).toEqual({
            Name: 'tool-draft',
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool-draft/v1.0.0',
            Version: '1.0.0'
          })
        })
      })

      describe('when the conceptType is variable-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('variable-drafts', {}, {}, {
            providerId: 'EDSC',
            ummVersion: '1.0.0'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/variable-drafts')
          expect(draft.metadataSpecification).toEqual({
            Name: 'variable-draft',
            URL: 'https://cdn.earthdata.nasa.gov/umm/variable-draft/v1.0.0',
            Version: '1.0.0'
          })
        })
      })
    })
  })
})
