import "dotenv/config"
import express,{Request,Response} from "express"
import cors from 'cors'
import {createServer} from "http"
import { socketManager } from './socket/socket.manager'
import "./workers/critical.worker"
import "./workers/high.worker"
import "./workers/low.worker"

import authRouter from './routes/auth.routes'
import statsRouter from "./routes/stats.routes"
import notificationRouter from "./routes/notification.routes"
import userRouter from "./routes/user.routes"


const app = express()
const httpServer = createServer(app)
socketManager.initialise(httpServer)

// // enable CORS for frontend during development
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}))

app.use(express.json())

// fallback CORS headers in case the cors middleware doesn't run for some requests
app.use((req: Request, res: Response, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Credentials', 'true')
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
})

app.use("/api/auth",authRouter)
app.use("/api/stats",statsRouter)
app.use("/api/notifications",notificationRouter)
app.use("/api/user", userRouter)

httpServer.listen(9000,()=>{
    console.log("server listening at http://localhost:9000/")
})
