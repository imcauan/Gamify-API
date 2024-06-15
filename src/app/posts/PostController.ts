import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { PostEntity } from "./entities/PostEntity";

const prisma = new PrismaClient();

export class PostController {
  async create(req: Request, res: Response): Promise<PostEntity | undefined> {
    try {
      const { caption, location, tags, authorId } = req.body;
      const image = req.file?.filename;

      console.log({ caption, location, tags, authorId, image });

      if (!image) {
        res.status(400).json({ message: "Image not provided" });
        return;
      }

      const findUser = await prisma.users.findUnique({
        where: {
          id: authorId,
        },
      });

      if (!findUser) {
        res.status(404).json({ message: "User not found" });
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
          author: true,
        },
      });

      res.status(201).json({ message: "Post created", newPost });
    } catch (error) {
      console.log("Error while creating post", error);
    }
  }

  async update(req: Request, res: Response) {
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

  async delete(req: Request, res: Response) {
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
        commentaries: true,
      },
    });

    if (!posts) {
      return res.json({ message: "Something went wrong while getting posts." });
    }

    return res.send(posts);
  }

  async getPostById(req: Request, res: Response) {
    const { postId } = req.body;
    console.log(postId);

    const post = await prisma.posts.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: {
          include: {
            author: true,
          },
        },
        commentaries: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post was not found." });
    }

    res.send(post);
  }

  async likePost(req: Request, res: Response) {
    const { authorId, postId } = req.body;

    const post = await prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const findLikePost = await prisma.likes.findFirst({
      where: {
        postId,
        authorId,
      },
    });

    if (findLikePost) {
      await prisma.likes.delete({
        where: {
          id: findLikePost.id,
          postId: post.id,
          authorId,
        },
      });
      return res.status(201).json({ message: "Post has been unliked." });
    }

    const createdLike = await prisma.likes.create({
      data: {
        postId,
        authorId,
      },
      include: {
        author: true,
        post: true,
      },
    });

    return res.status(201).json(createdLike);
  }

  async savePost(req: Request, res: Response) {
    try {
      const { postId, userId } = req.body;
      const post = await prisma.posts.findUnique({
        where: {
          id: postId,
        },
      });
      if (!post) {
        return res.status(404).json({ error: "Post was not found." });
      }

      const user = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return res.status(404).json({ error: "User was not found." });
      }

      const save = await prisma.saves.create({
        data: {
          postId,
          userId
        },
        include: {
          post: true,
          user: true,
        }
      });

      if(!save) {
        return res.status(400).json(save);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createCommentary(req: Request, res: Response) {
    const { content, postId, userId } = req.body;

    try {    
      const findPost = await prisma.posts.findUnique({
          where: {
              id: postId
          }
      });

      if(!findPost) {
        return res.status(404).json({ message: "Post not found." })
      }

      const findAuthor = await prisma.users.findUnique({
        where: {
            id: userId
        }
      });

      if(!findAuthor) {
        return res.status(404).json({ message: "Post not found." })
      }

      const commentary = await prisma.commentaries.create({
        data: {
            postId,
            userId,
            content,
        },
        include: {
            post: true,
            user: true,
        }
      });

      return res.status(201).json({commentary: commentary})
    } catch (error) {
        console.log(error);
    }
  }

  async updateCommentary(req: Request, res: Response) {
    const { id, content } = req.body;

    const findCommentary = await prisma.commentaries.findUnique({
        where: {
            id,
        }
    })

    if(!findCommentary) {
        res.status(404).json({ message: "Commentary not found." })
        return;
    }

    const updateCommentary = await prisma.commentaries.update({
        where: {
            id: findCommentary.id
        },
        data: {
            content
        }
    })

    return res.status(200).json({ updateCommentary })
  }

  async deleteCommentary(req: Request, res: Response) {}
}
