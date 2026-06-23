import {socketManager} from '../socket/socket.manager'
import {emailService} from './email.service'

interface DeliverParams{
    notificationId : string,
    userId : string,
    channel : string,
    title : string,
    body : string,
    metadata? : any
}

export const deliveryService = {
    async deliver(params:DeliverParams){
        switch(params.channel){
            case 'INAPP' : 
                await this.deliverInApp(params)
                break
            case 'EMAIL' : 
                await this.deliverEmail(params)
                break
            case 'PUSH' :
                await this.deliverPush(params)
                break
        }
    },

    async deliverInApp({notificationId,userId,title,body,metadata}:DeliverParams){
         const delivered = await socketManager.sendToUser(userId,{
            notificationId,
            title,
            body,
            metadata,
            timestamp : new Date().toISOString()
         })
         if(!delivered){
            console.log(`User ${userId} is offline — notification stored in DB`)
         }
    },
    async deliverEmail({userId,title,body}:DeliverParams){
        const {prisma} = await import('../config/db')
        const user = await prisma.user.findUnique({
            where : {id : userId}
        })
        if(!user){
            throw new Error(`User ${userId} not found`)
        }
        await emailService.send({to:user.email,subject:title,body})
    },
    async deliverPush({userId,title,notificationId}:DeliverParams){
        console.log(`[PUSH SIMULATED] → User: ${userId} | Notification: ${notificationId} | Title: ${title}`)
    }
}