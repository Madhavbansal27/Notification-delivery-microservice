import { criticalQueue, highQueue, lowQueue } from '../config/queues'
import { prisma } from '../config/db'

interface CreateNotificationDTO {
  userId: string
  type: 'OTP' | 'ORDER_UPDATE' | 'PROMO' | 'SYSTEM_ALERT'
  channel: 'INAPP' | 'EMAIL' | 'PUSH'
  priority: 'CRITICAL' | 'HIGH' | 'LOW'
  title: string
  body: string
  metadata?: Record<string, any>
}

export const createNotification = async (data: CreateNotificationDTO) => {
  // 1. Save to DB
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      channel: data.channel,
      priority: data.priority,
      title: data.title,
      body: data.body,
      metadata: data.metadata,
      status: 'QUEUED'
    }
  })

  // 2. Add to correct queue
  const jobData = { notificationId: notification.id, ...data }

  switch (data.priority) {
    case 'CRITICAL':
      await criticalQueue.add('deliver', jobData, { priority: 1 })
      break
    case 'HIGH':
      await highQueue.add('deliver', jobData)
      break
    case 'LOW':
      await lowQueue.add('deliver', jobData)
      break
  }

  return notification
}
