import { parseCmrVariables } from '../parseCmrVariables'

describe('parseCmrVariables', () => {
  test('returns an empty array when the input is unrecognized', () => {
    const payload = {
      data: {
        errors: ['HTTP Error']
      }
    }

    const response = parseCmrVariables(payload, 'umm_json')

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

    const response = parseCmrVariables(payload)

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
            VariableType: 'SCIENCE_VARIABLE'
          }
        }, {
          meta: {
            'concept-id': 'S100001-EDSC'
          },
          umm: {
            VariableType: 'QUALITY_VARIABLE'
          }
        }]
      }
    }

    const response = parseCmrVariables(payload)

    expect(response).toEqual([{
      meta: {
        'concept-id': 'S100000-EDSC'
      },
      umm: {
        VariableType: 'SCIENCE_VARIABLE'
      }
    }, {
      meta: {
        'concept-id': 'S100001-EDSC'
      },
      umm: {
        VariableType: 'QUALITY_VARIABLE'
      }
    }])
  })
})
