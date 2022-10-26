import Redis from 'ioredis'
import { getRedisClient } from '../getRedisClient'

jest.mock('ioredis')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getRedisClient', () => {
  describe('when running deployed', () => {
    beforeEach(() => {
      process.env.IS_OFFLINE = 'false'
      process.env.cacheHost = 'host'
      process.env.cachePort = 'port'
    })

    test('sets up redis client correctly', () => {
      getRedisClient()

      expect(Redis).toHaveBeenCalledTimes(1)
      expect(Redis).toHaveBeenCalledWith({
        host: 'host',
        port: 'port'
      })
    })
  })

  describe('when running offline', () => {
    beforeEach(() => {
      process.env.IS_OFFLINE = 'true'
    })

    test('sets up redis client correctly', () => {
      getRedisClient()

      expect(Redis).toHaveBeenCalledTimes(1)
      expect(Redis).toHaveBeenCalledWith({
        host: 'localhost',
        port: '6379'
      })
    })
  })

  test('logs an error message', () => {
    Redis.mockImplementation(() => { throw new Error('mock-error') })
    const consoleMock = jest.spyOn(console, 'log')

    getRedisClient()

    expect(consoleMock).toHaveBeenCalledTimes(1)
    expect(consoleMock).toHaveBeenCalledWith('Error connecting to Redis: Error: mock-error')
  })
})
