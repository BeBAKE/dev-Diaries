import z from 'zod'

export const signinSchmea = z.object({
  email : z.string().email().min(1,{message : "enter valid format"}).trim(),
  password : z.string().min(8,{message : "minimum length voilation of 8 chars"}).trim()
})

export const signupSchmea = z.object({
  email : z.string().email().min(1,{message : "enter valid format"}).trim(),
  username : z.string().min(3,{message : "minimum length voilation of 3 chars"}).trim(),
  password : z.string().min(8,{message : "minimum length voilation of 8 chars"}).trim()
})