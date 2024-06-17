import { Context } from "hono"
import getPrisma from "../db"
import { UserSignIn,UserSignUp } from "../types/user"
import { Jwt } from "hono/utils/jwt"

const signin = async(c : Context) => {
  const { email , password } = c.get("parsedData")
  const prisma = getPrisma(c)
  try {
    const user = await prisma.user.findUnique({
      where : {
        email : email
      }
    })
    if(!user){
      return c.json({error : "user doesn't exist"},400)
    }

    if(user.password!==password){
      return c.json({error : "Invalid email or password"})
    }
    const token = await Jwt.sign({userId : user.id,exp : Math.floor(Date.now()/1000 + 60 * 60 * 24 * 2)},c.env.SECRET_KEY)
    
    return c.json({token : token},200)
  } catch (error : any) {
    return c.json({error : error.message},400)
  }
}
const signup = async(c : Context) => {
  const {email,username,password} : UserSignUp = c.get("parsedData")
  const prisma = getPrisma(c)
  try {
    const result = await prisma.user.create({
      data : {
        email : email,
        username : username,
        password : password
      }
    })

    const token = await Jwt.sign({
      userId : result.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
    },c.env.SECRET_KEY)

    return c.json({token : token},200)
  } catch (error : any ) {
    if(error?.code==='P2002' && error?.meta.target[0] === 'email'){
      return c.json({error : "User already exist , signin instead"})
    }
    return c.json({error : "Internal Server Error"},500)
  }
}

export {
  signin,
  signup
}