import { pickIgnoringCase } from '../pickIgnoringCase'

const inputObject = {
  Accept: '*/*',
  Authorization: 'Bearer one.two.three',
  'Content-Type': 'application/json'
}

describe('pickIgnoringCase', () => {
  test('returns an empty object when undefined is provided', () => {
    const returnObject = pickIgnoringCase(undefined)

    expect(returnObject).toMatchObject({})
  })

  describe('when the requested keys do not exist', () => {
    test('returns an empty object', () => {
      const returnObject = pickIgnoringCase(inputObject, ['missingKey'])

      expect(returnObject).toMatchObject({})
    })
  })

  describe('when the requested key does exist', () => {
    describe('when the case matches', () => {
      test('it returns the object with the correct case', () => {
        const returnObject = pickIgnoringCase(inputObject, ['Authorization'])

        expect(returnObject).toMatchObject({
          Authorization: 'Bearer one.two.three'
        })
      })
    })

    describe('when the case does not match', () => {
      test('it returns the object with the correct case', () => {
        const returnObject = pickIgnoringCase(inputObject, ['authorization', 'CoNtenT-type'])

        expect(returnObject).toMatchObject({
          authorization: 'Bearer one.two.three',
          'CoNtenT-type': 'application/json'
        })
      })
    })
  })
})
