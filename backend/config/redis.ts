import Redis from 'ioredis'

const parsedUrl = process.env.REDIS_URL ? new URL(process.env.REDIS_URL) : null;

export const redisOptions = parsedUrl
  ? {
      host: parsedUrl.hostname,
      port: Number(parsedUrl.port),
      username: parsedUrl.username || undefined,
      password: parsedUrl.password || undefined,
      tls: parsedUrl.protocol === 'rediss:' ? {} : undefined,
    }
  : {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379
    };

const redis = new Redis(redisOptions);

redis.on('connect', () => console.log('Redis connected'))
redis.on('error', (err) => console.error('Redis error:', err))

export default redis