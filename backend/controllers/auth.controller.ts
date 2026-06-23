import {Request, Response} from 'express'
import {prisma} from '../config/db'
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import "dotenv/config"
export const register = async (req:Request,res:Response)=>{
    try{
        const {name,email,password} = req.body
        if(!name || !email || !password){
            return res.status(400).json({
                "error" : "Name, email, password are required"
            })
        }
        const user = await prisma.user.findUnique({
            where :{
                email : email
            }
        })
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        if(user){
            return res.status(409).json({
                "message" : "user already exists"
            })
        }
        const newUser = await prisma.user.create({
            data:{
                email : email,
                name : name,
                password : hashedPassword
            }
        })
        const token = jwt.sign({
            userId : newUser.id,
        },process.env.JWT_SECRET_KEY!)
        return res.status(200).json({
            token,
            user :{
                id : newUser.id,
                name:newUser.name,
                email:newUser.email
            }
        })
    }catch(error){
        console.error("Registration error : ",error)
        return res.status(500).json({
            error : "internal server error"
        })
    }
}

export const login = async (req:Request,res:Response)=>{
    try{
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({
                "error" : "email and password are required"
            })
        }
        const user = await prisma.user.findUnique({
            where:{
                email : email
            }
        })
        if(!user){
            return res.status(401).json({
                "error" : "user does not exist"
            })
        }
        const isPasswordValid = await bcrypt.compare(user.password,password)
        if(!isPasswordValid){
            return res.status(401).json({
                "error" : "invalid credentials"
            })
        }
        const token = jwt.sign({
            userId : user.id
        },process.env.JWT_SECRET_KEY!,{
            expiresIn : "7d"
        })
        return res.status(200).json({
            token,
            user : {
                id:user.id,
                name:user.name,
                email:user.email
            }
        })
    }catch(error){
        console.error("Login error",error)
        return res.status(500).json({
            error : "Internal server error"
        })
    }
}

