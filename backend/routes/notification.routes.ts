import {Router} from "express"
import {getUserNotifications,sendNotification,getNotificationById} from "../controllers/notification.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const notificationRouter = Router()

notificationRouter.get("/:userId",authMiddleware, getUserNotifications)
notificationRouter.get("/detail/:id",authMiddleware,getNotificationById)
notificationRouter.post("/",authMiddleware, sendNotification)

export default notificationRouter
