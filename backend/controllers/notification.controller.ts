import { Request, Response } from 'express'
import { checkRateLimit } from '../services/rateLimit.service'
import { createNotification } from '../services/notification.service'
import { prisma } from '../config/db'

const notificationStatuses = ['QUEUED', 'FAILED', 'PROCESSING', 'DELIVERED'] as const

type NotificationStatusType = (typeof notificationStatuses)[number]

export const sendNotification = async (req: Request, res: Response) => {
  const { userId, type, channel, priority, title, body, metadata } = req.body

  if (!userId || !type || !channel || !priority || !title || !body) {
    return res.status(400).json({ error: 'Missing required notification fields' })
  }

  // 1. Rate limit check
  const rateLimit = await checkRateLimit(userId)
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: rateLimit.retryAfter
    })
  }

  // 2. Check user preferences
  const preferences = await prisma.userPreference.findUnique({ where: { userId } })
  if (preferences) {
    if (channel === 'EMAIL' && !preferences.emailEnabled) {
      return res.status(400).json({ error: 'User has disabled email notifications' })
    }
    // Check quiet hours
    if (preferences.quietHourStart !== null && preferences.quietHourEnd !== null) {
      const currentHour = new Date().getHours()
      const inQuietHours = preferences.quietHourStart > preferences.quietHourEnd
        ? currentHour >= preferences.quietHourStart || currentHour < preferences.quietHourEnd!
        : currentHour >= preferences.quietHourStart && currentHour < preferences.quietHourEnd!
      if (inQuietHours && priority !== 'CRITICAL') {
        return res.status(400).json({ error: 'User is in quiet hours. Only CRITICAL notifications allowed.' })
      }
    }
  }

  // 3. Create and queue notification
  const notification = await createNotification({ userId, type, channel, priority, title, body, metadata })

  return res.status(201).json({
    success: true,
    notificationId: notification.id,
    status: 'queued',
    message: `Notification queued in ${priority} queue`
  })
}

export const getUserNotifications = async (req: Request, res: Response) => {
  const userId = req.params.userId as string
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const statusParam = req.query.statusParam as string

  const status = typeof statusParam === 'string' && notificationStatuses.includes(statusParam as NotificationStatusType)
    ? (statusParam as NotificationStatusType)
    : undefined

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      ...(status ? { status } : {})
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit
  })

  return res.json({ notifications, page, limit })
}

export const getNotificationById = async (req: Request, res: Response) => {
  const id = req.params.id as string
  if (!id) {
    return res.status(400).json({ error: 'Notification id is required' })
  }

  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' })
  }
  return res.json({ notification })
}