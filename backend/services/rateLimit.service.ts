import redis from '../config/redis'

export const checkRateLimit = async (userId: string): Promise<{ allowed: boolean; retryAfter?: number }> => {
  const minuteKey = `notif:ratelimit:${userId}:minute`
  const hourKey = `notif:ratelimit:${userId}:hour`

  // Use a pipeline — both increments happen atomically
  const pipeline = redis.pipeline()
  pipeline.incr(minuteKey)
  pipeline.incr(hourKey)
  const results = await pipeline.exec()
  const minuteCount = results?.[0]?.[1] as number
  const hourCount = results?.[2]?.[1] as number
  if(minuteCount===1){
    redis.expire(minuteKey,60)
  }
  if(hourCount===1){
    redis.expire(hourKey,3600)
  }
  if (minuteCount > 5) return { allowed: false, retryAfter: 60 }
  if (hourCount > 20) return { allowed: false, retryAfter: 3600 }
  return { allowed: true }
}