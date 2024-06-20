import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { MessageEntity } from "./entities/MessageEntity";

const prisma = new PrismaClient();

export class MessageController {
  async create(req: Request, res: Response) {
    const { content, authorId, destination } = req.body;
    try {
      const message = await prisma.messages.create({
        data: {
          content,
          authorId,
          destination,
        },
      });
      if (!message) {
        res
          .status(400)
          .json({ message: "Something went wrong while creating message." });
      }
      return res.status(201).json(message);
    } catch (error) {
      console.log(error);
    }
  }
  async getMessageById(req: Request, res: Response) {
    const { id } = req.body;
    try {
      const message = await prisma.messages.findUnique({
        where: {
          id,
        },
      });
      if (!message) {
        return res
          .status(404)
          .json({ message: "Message not found." });
      }
      return res.status(200).json(message);
    } catch (error) {
      console.log(error);
    }
  }
  async update(req: Request, res: Response) {
    const { id, content } = req.body;
    if(!content && !id) {
        return res.status(400).json({ message: "content and id must be provided." })
    }
    try {
      const messageToUpdate = await prisma.messages.findUnique({
        where: {
            id
        }
      });
      if(!messageToUpdate) {
        return res.status(404).json({ message: "Message not found." });
      }
      const updatedMessage = await prisma.messages.update({
        where: {
            id: messageToUpdate.id
        },
        data: {
            content
        }
      })
      if(!updatedMessage) {
        return res.status(400).json({ message: "Something went wrong while updating message." });
      }
      return res.status(200).json(updatedMessage);
    } catch (error) {
      console.log(error);
    }
  }
  async delete(req: Request, res: Response) {
    const { id } = req.body;
    try {
      const messageToDelete = await prisma.messages.findUnique({
        where: {
            id
        }
      });
      if(!messageToDelete) {
        return res.status(404).json({ message: "Message not found." });
      }
      const deletedMessage = await prisma.messages.delete({
        where: {
            id: messageToDelete.id
        }
      });
      if(!deletedMessage) {
        return res.status(400).json({ message: "Something went wrong while deleting message." });
      }
      return res.status(200).json({ message: "Message has been deleted." })
    } catch (error) {
      console.log(error);
    }
  }
}
