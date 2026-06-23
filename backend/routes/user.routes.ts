import { getPreferences,updatePreferences } from "../controllers/user.controller";
import {Router} from "express"
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter = Router()

userRouter.get("/:userId/preferences",authMiddleware,getPreferences)
userRouter.put("/:userId/preferences",authMiddleware,updatePreferences)

export default userRouter