import {Hono} from "hono"
import * as bp from "../controller/post"
import auth from "../middleware/auth"
import { zodValidation } from "../middleware/zodValidation"
import { blogPostSchema, updateBlogPostSchema } from "../Schema/post"

const postRouter = new Hono()

postRouter.get('/',auth,bp.getAllBlogPost)

postRouter.post('/',auth,zodValidation(blogPostSchema),bp.createBlogPost)

postRouter.get('/:id',auth,bp.getBlogPost)

postRouter.put("/:id",auth,zodValidation(updateBlogPostSchema),bp.updateBlogPost)

postRouter.delete("/:id",auth,bp.deleteBlogPost)

export default postRouter