import {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { getQueueStats,getDeliveryStats,getFailedNotifications } from "../controllers/stats.controller"

const statsRouter = Router()
statsRouter.get("/queues",getQueueStats)
statsRouter.get("/delivery",getDeliveryStats)
statsRouter.get("/failed",getFailedNotifications)

export default statsRouter