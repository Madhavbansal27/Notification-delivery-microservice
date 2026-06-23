import { Request, Response } from 'express'
import { prisma } from '../config/db'

export const getPreferences = async (req: Request, res: Response) => {
  const userId= req.params.userId as string

  const preferences = await prisma.userPreference.findUnique({ where: { userId } })
  if (!preferences) {
    return res.status(404).json({ error: 'Preferences not found' })
  }

  return res.json({ preferences })
}

export const updatePreferences = async (req: Request, res: Response) => {
  const userId = req.params.userId as string
  const { emailEnabled, inappEnabled, pushEnabled, quietHourStart, quietHourEnd } = req.body

  const preferences = await prisma.userPreference.upsert({
    where: { userId },
    update: { emailEnabled, inappEnabled, pushEnabled, quietHourStart, quietHourEnd },
    create: { userId, emailEnabled, inappEnabled, pushEnabled, quietHourStart, quietHourEnd }
  })

  return res.json({ message: 'Preferences updated', preferences })
}