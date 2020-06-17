import { parseCmrTools } from '../parseCmrTools'

describe('parseCmrTools', () => {
  test('returns an empty array when the input is unrecognized', () => {
    const payload = {
      data: {
        errors: ['HTTP Error']
      }
    }

    const response = parseCmrTools(payload, 'umm_json')

    expect(response).toEqual([])
  })

  test('parses json correctly', () => {
    const payload = {
      data: {
        items: [{
          concept_id: 'T100000-EDSC'
        }, {
          concept_id: 'T100001-EDSC'
        }]
      }
    }

    const response = parseCmrTools(payload)

    expect(response).toEqual([{
      concept_id: 'T100000-EDSC'
    }, {
      concept_id: 'T100001-EDSC'
    }])
  })

  test('parses umm correctly', () => {
    const payload = {
      data: {
        items: [{
          meta: {
            'concept-id': 'T100000-EDSC'
          },
          umm: {
            Type: 'OPeNDAP'
          }
        }, {
          meta: {
            'concept-id': 'T100001-EDSC'
          },
          umm: {
            Type: 'ESI'
          }
        }]
      }
    }

    const response = parseCmrTools(payload)

    expect(response).toEqual([{
      meta: {
        'concept-id': 'T100000-EDSC'
      },
      umm: {
        Type: 'OPeNDAP'
      }
    }, {
      meta: {
        'concept-id': 'T100001-EDSC'
      },
      umm: {
        Type: 'ESI'
      }
    }])
  })
})
