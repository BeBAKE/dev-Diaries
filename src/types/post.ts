import { blogPostSchema,updateBlogPostSchema } from "../Schema/post";
import z from 'zod'

export type BlogPostType = z.infer<typeof blogPostSchema>
export type UpdateBlogPostType = z.infer<typeof updateBlogPostSchema>
// export type UpdateBlogPostType = Partial<BlogPostType>