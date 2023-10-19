import Draft from '../draft'

describe('Draft concept', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
    process.env.ummCollectionVersion = '1.0.0'
    process.env.ummServiceVersion = '1.0.0'
    process.env.ummToolVersion = '1.0.0'
    process.env.ummVariableVersion = '1.0.0'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('Draft concept', () => {
    describe('constructor', () => {
      describe('when the conceptType is collection-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('collection-drafts', {}, {}, {
            draftConceptId: 'CD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/collection-drafts')
          expect(draft.publishPath).toEqual('publish/CD100000-EDSC')
          expect(draft.metadataSpecification).toEqual({
            Name: 'UMM-C',
            URL: 'https://cdn.earthdata.nasa.gov/umm/collection/v1.0.0',
            Version: '1.0.0'
          })
        })
      })

      describe('when the conceptType is service-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('service-drafts', {}, {}, {
            draftConceptId: 'SD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/service-drafts')
          expect(draft.publishPath).toEqual('publish/SD100000-EDSC')
          expect(draft.metadataSpecification).toEqual({
            Name: 'UMM-S',
            URL: 'https://cdn.earthdata.nasa.gov/umm/service/v1.0.0',
            Version: '1.0.0'
          })
        })
      })

      describe('when the conceptType is tool-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('tool-drafts', {}, {}, {
            draftConceptId: 'TD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/tool-drafts')
          expect(draft.publishPath).toEqual('publish/TD100000-EDSC')
          expect(draft.metadataSpecification).toEqual({
            Name: 'UMM-T',
            URL: 'https://cdn.earthdata.nasa.gov/umm/tool/v1.0.0',
            Version: '1.0.0'
          })
        })
      })

      describe('when the conceptType is variable-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('variable-drafts', {}, {}, {
            draftConceptId: 'VD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/variable-drafts')
          expect(draft.publishPath).toEqual('publish/VD100000-EDSC')
          expect(draft.metadataSpecification).toEqual({
            Name: 'UMM-Var',
            URL: 'https://cdn.earthdata.nasa.gov/umm/variable/v1.0.0',
            Version: '1.0.0'
          })
        })
      })

      describe('when the conceptType is not a supported draft', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('bad-drafts', {}, {}, {
            draftConceptId: 'CD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.ingestPath).toEqual('providers/EDSC/bad-drafts')
          expect(draft.publishPath).toEqual('publish/CD100000-EDSC')
          expect(draft.metadataSpecification).toEqual({
            Name: undefined,
            URL: 'https://cdn.earthdata.nasa.gov/umm/undefined/vundefined',
            Version: undefined
          })
        })
      })
    })
  })
})
