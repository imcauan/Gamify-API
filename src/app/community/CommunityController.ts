import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"

const prisma = new PrismaClient();

export class CommunityController {
    async create (req: Request, res: Response) {
        const { bio, name, owner } = req.body;
        const checkIfExistsByName = await prisma.communities.findUnique({
            where: {
                name: name
            }
        });
        if(checkIfExistsByName) {
            throw Error("Community with this name already exists!");
        }
        
        const newCommunity = await prisma.communities.create({
            data: {
                name: name,
                bio: bio,
                owner: owner,
            }
        });
        
        return res.status(200).json(newCommunity);
    }

    async update (req: Request, res: Response) {
        const { id, bio, name } = req.body;
        const findCommunityById = await prisma.communities.findFirst({
            where: {
                id: id
            }
        })
        if(!findCommunityById) {
            throw Error("Community was not found!")
        }

        const updateCommunity = await prisma.communities.update({
            where: {
                id: findCommunityById.id
            },
            data: {
                name,
                bio,
            }
        })
    }

    async delete (req: Request, res: Response) {
        const { id } = req.body;
        const findCommunityById = await prisma.communities.findUnique({
            where: {
                id: id
            }
        })
        if(!findCommunityById) {
            throw Error("Community was not found")
        }
        
        const deleteCommunity = await prisma.communities.delete({
            where: {
                id: id
            }
        })

        if(deleteCommunity) {
            res.status(200).json({ message: "Community has been deleted!" });
        }
    }
}