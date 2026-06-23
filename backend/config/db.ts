import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 1. Initialize a connection pool
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL 
})

// 2. Bind the pool to the Prisma adapter
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({adapter})