import { prepKeysForCmr } from '../prepKeysForCmr'

describe('prepKeysForCmr', () => {
  test('removes the index of nonIndexedKeys parameters', () => {
    const params = {
      a: ['a', 'b']
    }
    const nonIndexedKeys = ['a']

    expect(prepKeysForCmr(params, nonIndexedKeys)).toEqual('a[]=a&a[]=b')
  })

  test('does not remove the index of parameters', () => {
    const params = {
      a: ['a', 'b']
    }

    expect(prepKeysForCmr(params)).toEqual('a[0]=a&a[1]=b')
  })
})
