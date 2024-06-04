import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();
type JwtPayload = {
    id: string
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers;
    
        if (!authorization) {
            res
            .status(401)
            .json({ message: "Unauthorized, no token" });
            return;
        }

        const token = authorization.split(' ')[1]
        const { id } = jwt.verify(token, process.env.DB_PASS ?? "") as JwtPayload

        const user = await prisma.users.findUnique({where: { id }})

        if(!user) {
            res
            .status(401)
            .json({ message: "Unauthorized" })
        }
        
        const { ...loggedUser } = user
        req.user = loggedUser

        next();
}