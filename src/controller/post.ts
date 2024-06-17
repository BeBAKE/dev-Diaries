import { Context } from "hono"
import { BlogPostType,UpdateBlogPostType } from "../types/post"
import getPrisma from "../db"

const getAllBlogPost = async(c:Context)=>{
  const prisma = getPrisma(c)
  const userId = <number>c.get("payload")?.userId
  console.log(userId)
  try {
    const blogPosts = await prisma.post.findMany()
    if(userId){
      blogPosts.forEach(e => {
        e.userId===userId ? e.owner=true : ""
      })
    }
    return c.json({data : blogPosts},200)
  } catch (error) {
    return c.json({error},400)
  }
}

const createBlogPost = async(c:Context)=>{
  const { title , body } : BlogPostType = c.get("parsedData")
  const prisma = getPrisma(c)
  const userId = <number>c.get("payload")?.userId
  console.log({title,body,userId})
  try {
    const post = await prisma.post.create({
      data : {
        title : title,
        body : body,
        userId : userId
      },
    })
    return c.json({success : `post created with Id : ${post.id}`},200)
  } catch (error) {
    return c.json({error},400)
  }
}

const getBlogPost = async(c:Context)=>{
  const id : number= Number(c.req.param("id"))
  if(isNaN(id)){
    return c.json({error : `Can't retrieve post with specific id : ${id}`},400)
  }
  const prisma = getPrisma(c)
  const userId = c.get("payload")?.userId
  try {
    const blogPost = await prisma.post.findFirst({
      where : {
        id : id
      }
    })
    if(!blogPost){
      return c.json({error : "no blogpost found"},400)
    }

    if(blogPost.userId===userId){
      blogPost.owner = true
    }
    return c.json({data : blogPost},200)
  } catch (error) {
    return c.json({error},400)
  }
}

const updateBlogPost = async(c:Context)=>{
  const title = c.get("parsedData")?.title
  const body = c.get("parsedData")?.body
  console.log(title)
  console.log(body)
  if(!body && !title){
    return c.json({error : "No data given to update"},400)
  }
  const id = Number(c.req.param("id"))
  const userId = <number>c.get("payload")?.userId
  const prisma = getPrisma(c)
  try {
    let data : UpdateBlogPostType = {}
    if(title) data.title = title
    if(body) data.body = body
    console.log(data)
    const update = await prisma.post.update({
      data : data,
      where : {
        id : id,
        userId : userId
      }
    })
    return c.json({success : update},200)
  } catch (error : any) {
    return c.json({error : error.message})
  }
}

const deleteBlogPost = async(c:Context)=>{
  const id = Number(c.req.param("id"))
  const prisma = getPrisma(c)
  const userId = <number>c.get("payload")?.userId
  if(!userId){
    return c.json({error : "Internal Server Error"},500)
  }
  try {
    const delBlogPost = await prisma.post.delete({
      where : {
        id : id,
        userId : userId
      }
    }) 
    return c.json({success : "Blogpost deleted successfully"},200)
  } catch (error:any) {
    if(error.code==="P2025"){
      return c.json({error : `Either you are not authenticated or BlogPost doesn't exist`})
    }
    return c.json({error},400)
  }


}

export {
  getAllBlogPost,
  createBlogPost,
  getBlogPost,
  updateBlogPost,
  deleteBlogPost
}


//  - GET /posts - Retrieve all blog posts.
// Actions: Fetch a list of all blog posts. Can be public or user-specific based on authentication.

//  - POST /posts - Create a new blog post.
// Inputs: title, body
// Actions: Create a new blog post associated with the authenticated user. Require authentication.

//  - GET /posts/:id - Retrieve a single blog post by ID.
// Actions: Fetch details of a specific blog post. Can be public or have additional details/edit capabilities for the owner.

//  - PUT /posts/:id - Update a blog post by ID.
// Inputs: title, body
// Actions: Update the specified blog post if the authenticated user is the owner. Require authentication.

//  - DELETE /posts/:id - Delete a blog post by ID.
// Actions: Delete the specified blog post if the authenticated user is the owner. Require authentication.