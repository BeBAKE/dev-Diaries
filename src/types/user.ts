import z from 'zod'
import { signinSchmea,signupSchmea } from "../Schema/user";

export type UserSignIn = z.infer<typeof signinSchmea>
export type UserSignUp = z.infer<typeof signupSchmea>