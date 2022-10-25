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
  console.log('🚀 ~ file: getRedisClient.js ~ line 12 ~ getRedisClient ~ host', host)
  console.log('🚀 ~ file: getRedisClient.js ~ line 12 ~ getRedisClient ~ port', port)

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
