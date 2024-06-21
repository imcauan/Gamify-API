import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { UserEntity } from "../auth/entites/UserEntity";

const prisma = new PrismaClient();

export class ChatController {
  async create(req: Request, res: Response) {
    const { firstId, secondId } = req.body;

    try {
      const firstUserExists = await prisma.users.findUnique({
        where: {
          id: firstId,
        },
      });
      if (!firstUserExists) return res.status(404);
      const secondUserExists = await prisma.users.findUnique({
        where: {
          id: secondId,
        },
      });
      if (!secondUserExists) return res.status(404);

      const chat = await prisma.chats.create({
        data: {
          members: [firstId, secondId],
        },
      });

      return res.status(201).json(chat);
    } catch (error) {
      console.log(error);
    }
  }
  async getChatById(req: Request, res: Response) {
    const { id } = req.body;

    try {
      const chat = await prisma.chats.findUnique({
        where: {
          id,
        },
        include: {
          messages: true,
        },
      });

      if (!chat) return res.status(404);

      return res.status(200).send(chat);
    } catch (error) {
      console.log(error);
    }
  }
  async delete(req: Request, res: Response) {
    const { id } = req.body;

    try {
      const chatToDelete = await prisma.chats.findUnique({
        where: {
          id,
        },
      });

      if (!chatToDelete) return res.status(404);

      const deletedChat = await prisma.chats.delete({
        where: {
          id: chatToDelete.id,
        },
      });

      return res.status(200).json({ message: "Chat deleted." });
    } catch (error) {
      console.log(error);
    }
  }
}
