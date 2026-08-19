import { prisma } from './prisma'
import crypto from 'crypto'

export async function createApiKey(opts: { userId?: string | null; monthlyQuota?: number } = {}) {
  const key = crypto.randomBytes(24).toString('hex')
  const rec = await prisma.apiKey.create({
    data: {
      key,
      userId: opts.userId || undefined,
      monthlyQuota: opts.monthlyQuota ?? 1000,
    }
  })
  return rec
}

export async function getApiKeyByKey(key: string) {
  return prisma.apiKey.findUnique({ where: { key } })
}

export async function recordUsage(apiKeyId: string, endpoint = '/api/free') {
  // increment counter and append usage row
  await prisma.apiUsage.create({ data: { apiKeyId, endpoint } })
  return prisma.apiKey.update({ where: { id: apiKeyId }, data: { usageCount: { increment: 1 } } })
}

export async function isWithinQuota(apiKey: any) {
  if (!apiKey) return false
  if (apiKey.revoked) return false
  // simple reset-once-per-month logic
  const now = new Date()
  const reset = new Date(apiKey.usageReset)
  if (now.getUTCMonth() !== reset.getUTCMonth() || now.getUTCFullYear() !== reset.getUTCFullYear()) {
    // reset counters
    await prisma.apiKey.update({ where: { id: apiKey.id }, data: { usageCount: 0, usageReset: now } })
    apiKey.usageCount = 0
    apiKey.usageReset = now
  }
  return apiKey.usageCount < apiKey.monthlyQuota
}
