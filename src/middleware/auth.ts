import { Context,Next } from "hono";
import { Jwt } from "hono/utils/jwt";

const auth = async(c:Context,next:Next)=>{
  const secretKey : string = c.env.SECRET_KEY
  let token = c.req.header("Authorization")
  try {
    if(!token || !token.startsWith("Bearer ")){
      throw new Error("Invalid token")
    }
    token = token.split(' ')[1]
    const payload = await Jwt.verify(token,secretKey)
    c.set("payload",payload)
    await next()
  } catch (error : any) {
    console.log(error.message)
    const pattern = new RegExp(`/api/v1/post(/[^/\n]+)?$`)
    const route = c.req.path
    if(pattern.test(route) && c.req.method==='GET'){
      console.log('just bypassing')
      await next()
    }
    else{
      return c.json({error:error.message},403)
    }
  }
}

export default auth


