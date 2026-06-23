import { Request, Response, NextFunction } from 'express'
import { checkRateLimit } from '../services/rateLimit.service' // Assuming this is where checkRateLimit is exported
export interface CustomRequest extends Request {
    user?: any; 
}
export const rateLimiter = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || req.ip
    if (!userId) {
      return res.status(400).json({ error: 'User identifier is required' })
    }
    const { allowed, retryAfter } = await checkRateLimit(userId)
    if (!allowed) {
      if (retryAfter) {
        res.set('Retry-After', String(retryAfter))
      }
      return res.status(429).json({ 
        error: 'Too Many Requests', 
        retryAfter 
      })
    }
    next()
    
  } catch (error) {
    next(error)
  }
}