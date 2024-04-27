import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"

const prisma = new PrismaClient();

module.exports = {
    create: async (req: Request, res: Response) => {
        const { author, title, imageUrl, content } = req.body;
        const newPost = await prisma.post.create({
            data: {
                author: author,
                title: title,
                content: content,
                imageUrl: imageUrl
            }
        })
        if(!newPost) {
            res.status(500).json({ message: "Something went wrong while creating post."})
        } 
        return res.status(200).json(newPost);
    },

    delete: async (req: Request, res: Response) => {
        const { id, author } = req.body;
        const postToDelete = await prisma.post.findUnique({
            where: {
                id: id,
                author: author 
            }
        })
        if(!postToDelete) {
            res.status(404).json({ message: "The post was not found!" })
        }
        const deletePost = await prisma.post.delete({
            where: {
                id: id,
            }
        })
        if(deletePost) {
            res.status(200).json({ message: "Post has been deleted!"} )
        }
    },
}