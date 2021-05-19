import { prepKeysForCmr } from '../prepKeysForCmr'

describe('prepKeysForCmr', () => {
  test('removes the index of nonIndexedKeys parameters', () => {
    const params = {
      a: ['a', 'b']
    }
    const nonIndexedKeys = ['a']

    expect(prepKeysForCmr(params, nonIndexedKeys)).toEqual('a%5B%5D=a&a%5B%5D=b')
  })

  test('does not remove the index of parameters', () => {
    const params = {
      a: ['a', 'b']
    }
    const nonIndexedKeys = []

    expect(prepKeysForCmr(params, nonIndexedKeys)).toEqual('a%5B0%5D=a&a%5B1%5D=b')
  })
})
