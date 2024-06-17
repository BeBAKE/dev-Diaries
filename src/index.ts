import {Env, ExecutionContext, Hono , Next,Context} from "hono" 
import indexRouter from './routes/index'
import { JWTPayload } from "hono/utils/jwt/types"

declare module "hono" {
	interface ContextVariableMap {
		userId : number
		token : string
		payload : JWTPayload
		parsedData : any
	}
}

const app = new Hono()
// app.use(prisma)

app.use(async(c : Context , next : Next)=>{
	console.log(".......................")
	await next()
	console.log(".......................")
})


app.route('/api/v1',indexRouter)

app.notFound(async(c)=>{
	c.status(404)
	return c.json({error : "404 Route not found"})
})

export default {
	fetch(request : Request , env : Env ,ctx : ExecutionContext){
		return app.fetch(request,env,ctx)
	}
}

// export default app


