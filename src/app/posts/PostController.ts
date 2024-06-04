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
    const allPosts = await prisma.posts.findMany()

    if(!allPosts) {
      return res.json({ message: "Something went wrong while getting posts."})
    }

    return res.json({
      posts: {
        ...allPosts
      }
    })
  }
};
