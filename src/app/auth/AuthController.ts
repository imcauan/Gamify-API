import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import * as jwt  from "jsonwebtoken";
const prisma = new PrismaClient();

 export class AuthController {
  async signIn (req: Request, res: Response) {
      const { email, password } = req.body;
      
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });
      
      if (!user) {
        return res
          .status(403)
          .json({ error: "Email or password might be wrong." });
      }

      const comparePassword = await compare(password, user.password);
      if(!comparePassword) {
        throw Error("Email or password might be wrong.")
      }
      
      const token = jwt.sign(user, process.env.DB_PASS ?? '', { 
        expiresIn: "1h" 
      });

      console.log(token)
      const {password: _, ...rest} = user
      return res.status(201).json({
        token: token
      })
  }

  async signUp (req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const existsUserEmail = await prisma.users.findUnique({
        where: { email: email },
      });
      if (existsUserEmail) {
        res
          .status(409)
          .json({ error: "A user with this email already exists!" });
      }

      const existsUsername = await prisma.users.findUnique({
        where: { username: username },
      });
      if (existsUsername) {
        res
          .status(409)
          .json({ error: "A user with this username already exists!" });
      }
      
      const hashedPassword = await hash(password, 10);
      const newUser = await prisma.users.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });
      const { password: newUserPassword, ...rest } = newUser;
      return res.json({ user: rest });
    } catch (error) {
      console.log(error);
    }
  }
};
