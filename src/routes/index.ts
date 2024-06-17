import {Hono} from "hono"
const indexRouter = new Hono()

import userRouter from '../routes/user'
import postRouter from '../routes/post'

indexRouter.route('/user',userRouter)
indexRouter.route('/post',postRouter)


export default indexRouter