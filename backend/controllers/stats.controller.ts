import {Request,Response} from "express"
import {lowQueue,highQueue,criticalQueue} from '../config/queues'
import {prisma} from '../config/db'
import {socketManager} from '../socket/socket.manager'

export const getQueueStats = async(req:Request,res:Response)=>{
    const [criticalCounts, highCounts, lowCounts] = await Promise.all([
        criticalQueue.getJobCounts('waiting', 'active', 'completed', 'failed'),
        highQueue.getJobCounts('waiting', 'active', 'completed', 'failed'),
        lowQueue.getJobCounts('waiting', 'active', 'completed', 'failed'),
    ])
    return res.json({
        critical: criticalCounts,
        high: highCounts,
        low: lowCounts,
        onlineUsers: socketManager.getOnlineCount()
    })
}

export const getDeliveryStats = async(req:Request, res:Response)=>{
    const [delivered, failed, pending] = await Promise.all([
        prisma.notification.count({ where: { status: 'DELIVERED' } }),
        prisma.notification.count({ where: { status: 'FAILED' } }),
        prisma.notification.count({ where: { status: { in: ['QUEUED', 'PROCESSING'] } } }),
    ])
    const total = delivered + failed
    return res.json({
        delivered,
        failed,
        pending,
        successRate: total > 0 ? ((delivered / total) * 100).toFixed(1) + '%' : 'N/A'
    })
}

export const getFailedNotifications = async (req: Request, res: Response) => {
  const failed = await prisma.notification.findMany({
    where: { status: 'FAILED' },
    include: { user: { select: { email: true, name: true } } },
    orderBy: { failedAt: 'desc' },
    take: 50
  })
  return res.json({ failed })
}