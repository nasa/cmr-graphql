import Service from '../service'

describe('Service concept', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    jest.restoreAllMocks()
  })

  describe('Service concept', () => {
    describe('retrieve the parent collection', () => {
      describe('if a parent collection is passed into the service', () => {
        test('Ensure that the parentCollectionConceptId can be passed to child queries', () => {
          const service = new Service({}, {}, {}, 'C100000-EDSC')
          service.associationDetails = {}
          const items = { meta: { 'association-details': {} } }
          service.setEssentialUmmValues('S100000-EDSC', items)
          expect(service.parentCollectionConceptId).toEqual('C100000-EDSC')
        })
      })
    })
  })
})
