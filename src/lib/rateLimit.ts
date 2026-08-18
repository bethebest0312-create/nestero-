const requests = new Map<string, number[]>()

export function isRateLimited(key: string, limit = 60, windowSeconds = 60) {
  const now = Date.now()
  const windowStart = now - windowSeconds * 1000
  const arr = requests.get(key) || []
  const recent = arr.filter((t) => t > windowStart)
  recent.push(now)
  requests.set(key, recent)
  return recent.length > limit
}

export function resetRateLimit(key: string) {
  requests.delete(key)
}
