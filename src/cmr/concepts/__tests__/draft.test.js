import Draft from '../draft'

describe('Draft concept', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

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

          expect(draft.publishPath).toEqual('publish/CD100000-EDSC')
        })
      })

      describe('when the conceptType is service-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('service-drafts', {}, {}, {
            draftConceptId: 'SD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.publishPath).toEqual('publish/SD100000-EDSC')
        })
      })

      describe('when the conceptType is tool-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('tool-drafts', {}, {}, {
            draftConceptId: 'TD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.publishPath).toEqual('publish/TD100000-EDSC')
        })
      })

      describe('when the conceptType is variable-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('variable-drafts', {}, {}, {
            draftConceptId: 'VD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.publishPath).toEqual('publish/VD100000-EDSC')
        })
      })

      describe('when the conceptType is visualization-drafts', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('visualization-drafts', {}, {}, {
            draftConceptId: 'VISD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.publishPath).toEqual('publish/VISD100000-EDSC')
        })
      })

      describe('when the conceptType is citation-draft', () => {
        test('set the ingestPath and metadataSpecification correctly', () => { 
          const draft = new Draft('citation=metadata', {}, {}, {
            draftConceptId: 'CITD100000-EDSC',
            providerId: 'EDSC'
          })
         
          expect(draft.publishPath).toEqual('publish/CITD100000-EDSC')
         })
      })
      

      describe('when the conceptType is not a supported draft', () => {
        test('sets the ingestPath and metadataSpecification correctly', () => {
          const draft = new Draft('bad-drafts', {}, {}, {
            draftConceptId: 'CD100000-EDSC',
            providerId: 'EDSC'
          })

          expect(draft.publishPath).toEqual('publish/CD100000-EDSC')
        })
      })
    })
  })
})
