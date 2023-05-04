import Granule from '../granule'

describe('granule', () => {
  describe('normalizeUmmItem', () => {
    describe('cloud coverage', () => {
      test('Ensure cloud_cover as an additional attribute is moved to a top level property', () => {
        const granule = new Granule({}, {}, {})
        const item = {
          umm: {
            AdditionalAttributes: [{ Name: 'CLOUD_COVERAGE', Values: ['50.0'] }]
          }
        }
        expect(granule.normalizeUmmItem(item)).toEqual({ ...item, CloudCover: 50 })
      })

      test('Ensure invalid cloud_cover is not normalized', () => {
        const granule = new Granule({}, {}, {})
        const item = {
          umm: {
            AdditionalAttributes: [{ Name: 'CLOUD_COVERAGE', Values: ['NONE'] }]
          }
        }
        expect(granule.normalizeUmmItem(item)).toEqual(item)
      })

      test('Ensure no cloud_cover does not fail', () => {
        const granule = new Granule({}, {}, {})
        const item = {
          umm: {
            AdditionalAttributes: []
          }
        }
        expect(granule.normalizeUmmItem(item)).toEqual(item)
      })
    })
  })
})
