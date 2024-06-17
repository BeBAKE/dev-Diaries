import { Context } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { env } from 'hono/adapter'

type ExtendedPrismaClient = PrismaClient & ReturnType<typeof withAccelerate>

let prisma: ExtendedPrismaClient 

const getPrisma = (c: Context) => {
  if (!prisma) {
    const client = new PrismaClient({
      datasourceUrl: env<{ DATABASE_URL: string }>(c).DATABASE_URL,
    })
    prisma = client.$extends(withAccelerate())  as unknown as ExtendedPrismaClient
  }
  return prisma
}

export default getPrisma

// const getPrisma = (c:Context)=> {
//   if(!prisma){
//     prisma = new PrismaClient({
//       datasourceUrl: env<{DATABASE_URL : string}>(c).DATABASE_URL
//     }).$extends(withAccelerate())

//   }

//   return prisma
// }
// export default getPrisma

// const prisma = new PrismaClient({
//   datasourceUrl : 
// }).$extends(withAccelerate())

//? alternate solution  
// make a hono function and then use it as the middleware like app.use(prisma) in the index.ts
// now in every handler use c.var.prisma to get this prisma client instance 

//! problem 
// const user = await c.var.prisma.create()
// user looses its type and shows type any 

// export const prisma = async (c:Context,next:Next) => { 
//   const prisma = new PrismaClient({
//     datasourceUrl : env<{DATABASE_URL:string}>(c).DATABASE_URL
//   }).$extends(withAccelerate())
//   c.set("prisma",prisma)
//   await next() 
// }



// export default prisma

