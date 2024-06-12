import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { PostEntity } from "./entities/PostEntity";

const prisma = new PrismaClient();

export class PostController {
  async create (req: Request, res: Response):Promise<PostEntity | undefined> {
    try {
      const { caption, location, tags, authorId } = req.body;
      const image = req.file?.filename;

      console.log({ caption, location, tags, authorId, image });
      
      if(!image) {
        res.status(400).json({ message: "Image not provided" })
        return;
      }
      
      const findUser = await prisma.users.findUnique({
        where: {
          id: authorId
        }
      });
      
      if(!findUser) {
        res.status(404).json({ message: "User not found" })
        return;
      }
      
      const newPost = await prisma.posts.create({
        data: {
          authorId,
          image,
          caption,
          location,
          tags,
        },
        include: {
          author: true
        }
      });

      res.status(201).json({ message: "Post created", newPost});
    } catch (error) {
      console.log("Error while creating post", error);
    }
  }

  async update (req: Request, res: Response) {
    const { id, caption } = req.body;

    const findPostToUpdate = await prisma.posts.findFirst({
      where: {
        id: id,
      },
    });

    if (!findPostToUpdate) {
      return res.status(404).json({ message: "Post was not found! " });
    }

    const updatePost = await prisma.posts.update({
      where: {
        id: findPostToUpdate.id,
      },
      data: {
        caption,
      },
    });
  }

  async delete (req: Request, res: Response) {
    const { id, author } = req.body;
    const postToDelete = await prisma.posts.findUnique({
      where: {
        id: id,
        author: author,
      },
    });
    if (!postToDelete) {
      res.status(404).json({ message: "The post was not found!" });
    }
    const deletePost = await prisma.posts.delete({
      where: {
        id: id,
      },
    });
    if (deletePost) {
      res.status(200).json({ message: "Post has been deleted!" });
    }
  }

  async getAll(req: Request, res: Response) {
    const posts = await prisma.posts.findMany({
      include: {
        author: true,
        likes: true,
        commentaries: true
      }
    })

    if(!posts) {
      return res.json({ message: "Something went wrong while getting posts."})
    }

    return res.send(posts)
  }

  async getPostById(req: Request, res: Response) {
    const { postId } = req.body;
    console.log(postId);

    const post = await prisma.posts.findUnique({
      where: {
        id: postId
      },
      include: {
        likes: {
          include: {
            author: true
          }
        },
        commentaries: {
          include: {
            user: true
          }
        },
      }
    })

    if(!post) {
      return res.status(404).json({ message: "Post was not found." });
    }

    res.send(post)
  }

  async likePost(req: Request, res: Response) {
    const { authorId, postId } = req.body;

    const post = await prisma.posts.findUnique({
      where: {
        id: postId
      }
    })

    if(!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const verifyLikePost = await prisma.likes.findUnique({
      where: {
        id: post.id,
        postId,
        authorId,
      }
    });

    if(verifyLikePost) {
      await prisma.likes.delete({
        where: {
          id: verifyLikePost.id,
          postId: post.id,
          authorId,
        }
      });
      return res.status(201).json({ message: "Post has been unliked." });
    }

    const like = await prisma.likes.create({
      data: {
        postId,
        authorId,
      },
      include: {
        author: true,
        post: true
      }
    })

    return res.status(201).json(like)
  }
};
