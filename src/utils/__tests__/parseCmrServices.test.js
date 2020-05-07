import { parseCmrServices } from '../parseCmrServices'

describe('parseCmrServices', () => {
  test('returns an empty array when the input is unrecognized', () => {
    const payload = {
      data: {
        errors: ['HTTP Error']
      }
    }

    const response = parseCmrServices(payload, 'umm_json')

    expect(response).toEqual([])
  })

  test('parses json correctly', () => {
    const payload = {
      data: {
        items: [{
          concept_id: 'S100000-EDSC'
        }, {
          concept_id: 'S100001-EDSC'
        }]
      }
    }

    const response = parseCmrServices(payload)

    expect(response).toEqual([{
      concept_id: 'S100000-EDSC'
    }, {
      concept_id: 'S100001-EDSC'
    }])
  })

  test('parses umm correctly', () => {
    const payload = {
      data: {
        items: [{
          meta: {
            'concept-id': 'S100000-EDSC'
          },
          umm: {
            Type: 'OPeNDAP'
          }
        }, {
          meta: {
            'concept-id': 'S100001-EDSC'
          },
          umm: {
            Type: 'ESI'
          }
        }]
      }
    }

    const response = parseCmrServices(payload)

    expect(response).toEqual([{
      meta: {
        'concept-id': 'S100000-EDSC'
      },
      umm: {
        Type: 'OPeNDAP'
      }
    }, {
      meta: {
        'concept-id': 'S100001-EDSC'
      },
      umm: {
        Type: 'ESI'
      }
    }])
  })
})
