import Concept from '../concept'

describe('collection', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()
  })

  describe('concept', () => {
    describe('getItemCount', () => {
      describe('no keys', () => {
        test('returns 0', () => {
          const concept = new Concept('concept')

          expect(concept.getItemCount()).toEqual(0)
        })
      })

      describe('both json and umm keys', () => {
        test('returns 84', () => {
          const concept = new Concept('concept', {}, {
            jsonKeys: ['jsonKey'],
            ummKeys: ['ummKey']
          })

          concept.setJsonItemCount(84)
          concept.setUmmItemCount(84)

          expect(concept.getItemCount()).toEqual(84)
        })
      })
    })
  })
})
