import { parseCmrCollections } from '../parseCmrCollections'

describe('parseCmrCollections', () => {
  test('returns an empty array when format is unrecognized', () => {
    const payload = {}

    const response = parseCmrCollections(payload, 'bad_format')

    expect(response).toEqual([])
  })

  describe('when format is json', () => {
    test('returns an empty array when the input is unrecognized', () => {
      const payload = {
        data: {
          errors: ['HTTP Error']
        }
      }

      const response = parseCmrCollections(payload)

      expect(response).toEqual([])
    })

    test('parses input correctly', () => {
      const payload = {
        data: {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }, {
              id: 'C100001-EDSC'
            }]
          }
        }
      }

      const response = parseCmrCollections(payload)

      expect(response).toEqual([{
        id: 'C100000-EDSC'
      }, {
        id: 'C100001-EDSC'
      }])
    })
  })

  describe('when format is umm', () => {
    test('returns an empty array when the input is unrecognized', () => {
      const payload = {
        data: {
          errors: ['HTTP Error']
        }
      }

      const response = parseCmrCollections(payload, 'umm_json')

      expect(response).toEqual([])
    })

    test('parses input correctly', () => {
      const payload = {
        data: {
          items: [{
            meta: {
              'concept-id': 'C100000-EDSC'
            },
            umm: {
              Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing.'
            }
          }, {
            meta: {
              'concept-id': 'C100000-EDSC'
            },
            umm: {
              Abstract: 'Nulla non tortor mauris. Phasellus pulvinar.'
            }
          }]
        }
      }

      const response = parseCmrCollections(payload, 'umm_json')

      expect(response).toEqual([{
        meta: {
          'concept-id': 'C100000-EDSC'
        },
        umm: {
          Abstract: 'Lorem ipsum dolor sit amet, consectetur adipiscing.'
        }
      }, {
        meta: {
          'concept-id': 'C100000-EDSC'
        },
        umm: {
          Abstract: 'Nulla non tortor mauris. Phasellus pulvinar.'
        }
      }])
    })
  })
})
