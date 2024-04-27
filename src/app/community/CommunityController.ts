import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"

const prisma = new PrismaClient();

module.exports = {
    create: async (req: Request, res: Response) => {
        const { bio, name, owner } = req.body;
        const checkIfExistsByName = await prisma.community.findUnique({
            where: {
                name: name
            }
        });
        if(checkIfExistsByName) {
            throw Error("Community with this name already exists!");

        }
        
        const newCommunity = await prisma.community.create({
            data: {
                name: name,
                bio: bio,
                owner: owner,
            }
        });
        
        return res.status(200).json(newCommunity);
    },

    update: async (req: Request, res: Response) => {
        const { id } = req.body;
        const findCommunityById = await prisma.community.findUnique({
            where: {
                id: id
            }
        })
        if(!findCommunityById) {
            throw Error("Community was not found!")
        }

        return res.status(200).json(findCommunityById)
    },

    delete: async (req: Request, res: Response) => {
        const { id } = req.body;
        const findCommunityById = await prisma.community.findUnique({
            where: {
                id: id
            }
        })
        if(!findCommunityById) {
            throw Error("Community was not found")
        }
        
        const deleteCommunity = await prisma.community.delete({
            where: {
                id: id
            }
        })

        if(deleteCommunity) {
            res.status(200).json({ message: "Community has been deleted!" });
        }
    }
}