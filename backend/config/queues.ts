import {Queue,QueueEvents} from "bullmq"
import {redisOptions} from './redis'

// Three separate queues for three priority levels
export const criticalQueue = new Queue('critical-notifications', {
  connection: redisOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 }, // 5s, 25s, 125s
    removeOnComplete: 100,  // keep last 100 completed jobs
    removeOnFail: 200,      // keep last 200 failed jobs
  }
})

export const highQueue = new Queue('high-notifications', {
  connection: redisOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 200,
  }
})

export const lowQueue = new Queue('low-notifications', {
  connection: redisOptions,
  defaultJobOptions: {
    delay: 30000,           // 30 second delay for promo notifications
    attempts: 2,
    backoff: { type: 'fixed', delay: 10000 },
    removeOnComplete: 100,
    removeOnFail: 200,
  }
})

export const queueEvents = {
  critical: new QueueEvents('critical-notifications', { connection: redisOptions }),
  high: new QueueEvents('high-notifications', { connection: redisOptions }),
  low: new QueueEvents('low-notifications', { connection: redisOptions }),
}
