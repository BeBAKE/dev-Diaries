import { Hono } from 'hono'
import * as usr from '../controller/user'
import { zodValidation } from '../middleware/zodValidation'
import { signupSchmea ,signinSchmea} from '../Schema/user'

const userRouter = new Hono()

userRouter.post('/signin',zodValidation(signinSchmea),usr.signin)

userRouter.post('/signup',zodValidation(signupSchmea),usr.signup)

export default userRouter