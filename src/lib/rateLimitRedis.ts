import IORedis from 'ioredis'

let client: IORedis.Redis | null = null
function getClient() {
  if (client) return client
  const url = process.env.REDIS_URL
  if (!url) return null
  client = new IORedis(url)
  return client
}

export async function isRateLimitedRedis(key: string, limit = 60, windowSeconds = 60) {
  const c = getClient()
  if (!c) return false
  const now = Date.now()
  const windowStart = now - windowSeconds * 1000
  const zkey = `rl:${key}`
  await c.zremrangebyscore(zkey, 0, windowStart)
  const len = await c.zcard(zkey)
  if (len >= limit) return true
  await c.zadd(zkey, now.toString(), now)
  await c.expire(zkey, windowSeconds + 5)
  return false
}
