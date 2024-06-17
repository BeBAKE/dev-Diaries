import z from 'zod'

export const blogPostSchema = z.object({
  title : z.string().min(3,{message : "Title minimum length voilation : 3 chars"}).trim(),
  body : z.string().min(3,{message : "Title minimum length voilation : 3 chars"}).trim(),
})
export const updateBlogPostSchema = z.object({
  title : z.string().min(3,{message : "Title minimum length voilation : 3 chars"}).trim().optional(),
  body : z.string().min(3,{message : "Title minimum length voilation : 3 chars"}).trim().optional(),
})
