import { isGranuleCountOnlySelection } from '../isGranuleCountOnlySelection'

const countField = {
  name: 'count',
  alias: 'count',
  args: {},
  fieldsByTypeName: {}
}

const granuleListWith = (fields) => ({
  name: 'granules',
  alias: 'granules',
  args: {},
  fieldsByTypeName: {
    GranuleList: fields
  }
})

describe('isGranuleCountOnlySelection', () => {
  describe('returns true', () => {
    test('when granules only requests count', () => {
      expect(isGranuleCountOnlySelection(granuleListWith({ count: countField }))).toBe(true)
    })

    test('when count is aliased', () => {
      expect(isGranuleCountOnlySelection(granuleListWith({
        totalCount: {
          name: 'count',
          alias: 'totalCount',
          args: {},
          fieldsByTypeName: {}
        }
      }))).toBe(true)
    })
  })

  describe('returns false', () => {
    test('when name is not granules', () => {
      expect(isGranuleCountOnlySelection({
        name: 'services',
        args: {},
        fieldsByTypeName: { ServiceList: { count: countField } }
      })).toBe(false)
    })

    test('when args are present', () => {
      expect(isGranuleCountOnlySelection({
        name: 'granules',
        args: { params: { onlineOnly: true } },
        fieldsByTypeName: { GranuleList: { count: countField } }
      })).toBe(false)
    })

    test('when items are also requested', () => {
      expect(isGranuleCountOnlySelection(granuleListWith({
        count: countField,
        items: {
          name: 'items',
          alias: 'items',
          args: {},
          fieldsByTypeName: {}
        }
      }))).toBe(false)
    })

    test('when cursor is also requested', () => {
      expect(isGranuleCountOnlySelection(granuleListWith({
        count: countField,
        cursor: {
          name: 'cursor',
          alias: 'cursor',
          args: {},
          fieldsByTypeName: {}
        }
      }))).toBe(false)
    })

    test('when GranuleList is empty', () => {
      expect(isGranuleCountOnlySelection(granuleListWith({}))).toBe(false)
    })

    test('when GranuleList is missing', () => {
      expect(isGranuleCountOnlySelection({
        name: 'granules',
        args: {},
        fieldsByTypeName: {}
      })).toBe(false)
    })
  })
})
