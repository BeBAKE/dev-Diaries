import { Next,Context } from 'hono'
import { ZodError, ZodTypeAny } from 'zod'

export const zodValidation = <T extends ZodTypeAny>(schema : T ) => {
  return async(c : Context,next : Next)=>{
    try {
      const body = await c.req.json()
      const parsedData = schema.parse(body)
      c.set("parsedData",parsedData)
      await next()
    }
    catch (error) {
      if(error instanceof ZodError){
        const errorMessage = error.errors.map(e => ({
          message : `${e.path.join(',')} -> ${e.message}`
        }))
        c.status(403)
        return c.json({error : "Invalid data format" , detail : errorMessage})
      }
      else {
        c.status(500)
        console.log(error)
        return c.json({error : "Internal Server Error"})
      }

    }
  }
}