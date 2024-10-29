import { parseError } from '../parseError'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('parseError', () => {
  describe('when standard errors are throw', () => {
    describe('when shouldLog is set to true', () => {
      test('it logs the errors', () => {
        const consoleMock = vi.spyOn(console, 'log')

        const response = parseError(new Error('Standard Error'))

        expect(consoleMock).toBeCalledTimes(1)
        expect(consoleMock.mock.calls[0]).toEqual(['Error: Standard Error'])

        expect(response).toEqual({
          statusCode: 500,
          body: JSON.stringify({
            statusCode: 500,
            errors: [
              'Error: Standard Error'
            ]
          })
        })
      })
    })

    describe('when shouldLog is set to false', () => {
      test('nothing is logged', () => {
        const consoleMock = vi.spyOn(console, 'log')

        const response = parseError(new Error('Standard Error'), { shouldLog: false })

        expect(consoleMock).toBeCalledTimes(0)

        expect(response).toEqual({
          statusCode: 500,
          body: JSON.stringify({
            statusCode: 500,
            errors: [
              'Error: Standard Error'
            ]
          })
        })
      })
    })
  })

  describe('http errors', () => {
    describe('with shouldLog is set to true', () => {
      describe('with no options', () => {
        test('it logs the errors', () => {
          const consoleMock = vi.spyOn(console, 'log')

          const response = parseError({
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
          })

          expect(consoleMock).toBeCalledTimes(1)
          expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): 400 Bad Request'])

          expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({
              statusCode: 400,
              errors: [
                '400 Bad Request'
              ]
            })
          })
        })

        describe('with no error name', () => {
          test('defaults the error name to `Error`', () => {
            const consoleMock = vi.spyOn(console, 'log')

            const response = parseError({
              response: {
                data: {
                  errors: [
                    '400 Bad Request'
                  ]
                },
                status: 400
              }
            })

            expect(consoleMock).toBeCalledTimes(1)
            expect(consoleMock.mock.calls[0]).toEqual(['Error (400): 400 Bad Request'])

            expect(response).toEqual({
              statusCode: 400,
              body: JSON.stringify({
                statusCode: 400,
                errors: [
                  '400 Bad Request'
                ]
              })
            })
          })
        })

        describe('with a single error', () => {
          test('it logs the error', () => {
            const consoleMock = vi.spyOn(console, 'log')

            const response = parseError({
              response: {
                data: {
                  error: 'Mock error message'
                },
                status: 400
              },
              name: 'HTTP Error'
            })

            expect(consoleMock).toBeCalledTimes(1)
            expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): Mock error message'])

            expect(response).toEqual({
              statusCode: 400,
              body: JSON.stringify({
                statusCode: 400,
                errors: [
                  'Mock error message'
                ]
              })
            })
          })
        })

        describe('with a path and error array within errors', () => {
          test('it parses the error correclty', () => {
            const consoleMock = vi.spyOn(console, 'log')

            const response = parseError({
              response: {
                data: {
                  errors: [{
                    path: [ 'Platforms', 0, 'ComposedOf' ],
                    errors: [
                      'Composed Of must be unique. This contains duplicates named [ATM].'
                    ]
                  }]
                },
                status: 422
              },
              name: 'CMR Error'
            })

            expect(consoleMock).toBeCalledTimes(1)
            expect(consoleMock.mock.calls[0]).toEqual([`CMR Error (422): {\"path\":[\"Platforms\",0,\"ComposedOf\"],\"errors\":[\"Composed Of must be unique. This contains duplicates named [ATM].\"]}`])

            expect(response).toEqual({
              statusCode: 422,
              body: JSON.stringify({
                statusCode: 422,
                errors: [
                  ['Location: Platforms[0] > ComposedOf', ['Composed Of must be unique. This contains duplicates named [ATM].']]
                ]
              })
            })
          })
        })

        describe('with no error or errors array', () => {
          test('defaults to an array containing `Unknown Error`', () => {
            const consoleMock = vi.spyOn(console, 'log')

            const response = parseError({
              response: {
                data: {
                  nonErrorsKey: 'will be ignored'
                },
                status: 400
              },
              name: 'HTTP Error'
            })

            expect(consoleMock).toBeCalledTimes(1)
            expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): Unknown Error'])

            expect(response).toEqual({
              statusCode: 400,
              body: JSON.stringify({
                statusCode: 400,
                errors: [
                  'Unknown Error'
                ]
              })
            })
          })
        })
      })

      describe('with asJSON set to false', () => {
        test('returns the errors array', () => {
          const consoleMock = vi.spyOn(console, 'log')

          const response = parseError({
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
          }, {
            asJSON: false
          })

          expect(consoleMock).toBeCalledTimes(1)
          expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): 400 Bad Request'])

          expect(response).toEqual([
            '400 Bad Request'
          ])
        })
      })

      describe('with reThrowError set to true', () => {
        test('rethrows the error provided', () => {
          const consoleMock = vi.spyOn(console, 'log')

          expect(() => parseError({
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
          }, {
            reThrowError: true
          })).toThrow()

          expect(consoleMock).toBeCalledTimes(1)
          expect(consoleMock.mock.calls[0]).toEqual(['HTTP Error (400): 400 Bad Request'])
        })
      })
    })

    describe('with shouldLog set to false', () => {
      describe('with asJSON set to false', () => {
        test('returns the errors array', () => {
          const consoleMock = vi.spyOn(console, 'log')

          const response = parseError({
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
          }, {
            asJSON: false,
            shouldLog: false
          })

          expect(consoleMock).toBeCalledTimes(0)

          expect(response).toEqual([
            '400 Bad Request'
          ])
        })
      })

      describe('with reThrowError set to true', () => {
        test('rethrows the error provided', () => {
          const consoleMock = vi.spyOn(console, 'log')

          expect(() => parseError({
            response: {
              data: {
                errors: [
                  '400 Bad Request'
                ]
              },
              status: 400
            },
            name: 'HTTP Error'
          }, {
            reThrowError: true,
            shouldLog: false
          })).toThrow()

          expect(consoleMock).toBeCalledTimes(0)
        })
      })
    })
  })
})
