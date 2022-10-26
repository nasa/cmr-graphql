import Redis from 'ioredis'

/**
 * Creates a redis client
 */
export const getRedisClient = () => {
  let host = process.env.cacheHost
  let port = process.env.cachePort

  if (process.env.IS_OFFLINE === 'true') {
    host = 'localhost'
    port = '6379'
  }

  let redis

  try {
    redis = new Redis({
      port,
      host
    })
  } catch (error) {
    console.log(`Error connecting to Redis: ${error}`)
  }

  return redis
}
