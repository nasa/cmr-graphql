import { parseCmrGranules } from '../parseCmrGranules'

describe('parseCmrGranules', () => {
  test('returns an empty array when format is unrecognized', () => {
    const payload = {}

    const response = parseCmrGranules(payload, 'bad_format')

    expect(response).toEqual([])
  })

  describe('when format is json', () => {
    test('parses input correctly', () => {
      const payload = {
        data: {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }, {
              id: 'G100001-EDSC'
            }]
          }
        }
      }

      const response = parseCmrGranules(payload)

      expect(response).toEqual([{
        id: 'G100000-EDSC'
      }, {
        id: 'G100001-EDSC'
      }])
    })

    test('returns an empty array when the input is unrecognized', () => {
      const payload = {
        data: {
          errors: ['HTTP Error']
        }
      }

      const response = parseCmrGranules(payload)

      expect(response).toEqual([])
    })
  })

  describe('when format is umm', () => {
    test('returns an empty array when the input is unrecognized', () => {
      const payload = {
        data: {
          errors: ['HTTP Error']
        }
      }

      const response = parseCmrGranules(payload, 'umm_json')

      expect(response).toEqual([])
    })

    test('parses input correctly', () => {
      const payload = {
        data: {
          items: [{
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'SC:AE_5DSno.002:30500511'
            }
          }, {
            meta: {
              'concept-id': 'G100000-EDSC'
            },
            umm: {
              GranuleUR: 'SC:AE_5DSno.002:30500512'
            }
          }]
        }
      }

      const response = parseCmrGranules(payload, 'umm_json')

      expect(response).toEqual([{
        meta: {
          'concept-id': 'G100000-EDSC'
        },
        umm: {
          GranuleUR: 'SC:AE_5DSno.002:30500511'
        }
      }, {
        meta: {
          'concept-id': 'G100000-EDSC'
        },
        umm: {
          GranuleUR: 'SC:AE_5DSno.002:30500512'
        }
      }])
    })
  })
})
