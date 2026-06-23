import {Server,Socket} from "socket.io"
import {Server as HTTPServer} from "http"
import jwt from "jsonwebtoken"

class SocketManager{
    private io: Server|null= null
    private userSocketMap : Map<string,string> = new Map()
    initialise(httpServer:HTTPServer){
        this.io = new Server(httpServer,{
            cors : {
                origin : process.env.FRONTEND_URL || 'http://localhost:5173',
                methods : ['GET','POST']
            }
        })
        //middleware for authentication using jsonwebtoken
        this.io.use((socket:Socket,next)=>{
            const token = socket.handshake.auth.token
            if(!token) return next(new Error('Auth Error'))
            try{
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as any
                socket.data.userId = decoded.userId
                next()
            }catch{
                next(new Error('Invalid token'))
            }
        })
        this.io.on("connection",(socket:Socket)=>{
            const userId = socket.data.userId
            console.log(`User with id ${userId} connected via socket`)
            this.userSocketMap.set(userId,socket.id)
            socket.on('disconnect',()=>{
                console.log(`User ${userId} disconnected`)
                this.userSocketMap.delete(userId)
            })
        })
    }
    sendToUser(userId: string, data: object): boolean {
        if (!this.io) return false
        const socketId = this.userSocketMap.get(userId)
        if (!socketId) return false // user is offline
        this.io.to(socketId).emit('notification', data)
        return true
    }
    getOnlineCount(): number {
        return this.userSocketMap.size
    }
}
export const socketManager = new SocketManager()