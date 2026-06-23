import {Worker,Job} from 'bullmq'
import {prisma} from '../config/db'
import {redisOptions} from '../config/redis'
import {deliveryService} from '../services/delivery.service'
export const lowWorker = new Worker('low-notifications',async(job:Job)=>{
    const {notificationId, userId, channel,title, body, metadata} = job.data
    //update status to processing
    await prisma.notification.update({
        where : {
            id : notificationId
        },
        data :{
            status : 'PROCESSING',
            attempts : job.attemptsMade +1
        }
    })
    // process the job
    await deliveryService.deliver({
        notificationId, userId, channel, title, body, metadata
    })
    //success
    await prisma.notification.update({
        where: { id: notificationId },
        data: { status: 'DELIVERED', deliveredAt: new Date() }
    })
},{
    connection : redisOptions,
    concurrency : 2
})

lowWorker.on('failed', async (job, error) => {
  if (job && job.attemptsMade >= 2) {
    await prisma.notification.update({
      where: { id: job.data.notificationId },
      data: { status: 'FAILED', failedAt: new Date() }
    })
    console.error(`Notification ${job.data.notificationId} permanently failed:`, error.message)
  }
})

