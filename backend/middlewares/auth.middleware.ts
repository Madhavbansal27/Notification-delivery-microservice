import jwt from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
export interface CustomRequest extends Request {
    user?: any; 
}
export const authMiddleware = async(req:CustomRequest,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(400).json({message:"Token not found"})
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY!)
        req.user = decoded as any
        next()
    }catch(error){
         res.status(401).json({ error: 'Invalid token' })
    }
}