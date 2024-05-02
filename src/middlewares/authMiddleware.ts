import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

const prisma = new PrismaClient();
type JwtPayload = {
    id: number
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { authorization } = req.headers;

        if (!authorization) {
            res.status(401);
            throw Error("Unauthorized.")
        }

        const token = authorization.split(' ')[1]
        const { id } = jwt.verify(token, process.env.DB_PASS ?? "") as JwtPayload

        const user = await prisma.user.findUnique({where: { id }})

        if(!user) {
            res.status(401)
            throw Error("Unauthorized.")
        }
        
        const { password: _, ...loggedUser } = user
        req.user = loggedUser

        next();
}