import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { hash } from "bcrypt";
const prisma = new PrismaClient();

module.exports = {
   signIn: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const findUser = await prisma.user.findUnique({ 
        where: {
          email,
          password,
        } 
      });

      if(!findUser) {
        throw Error("This user doesn't exist!")
      }
      if(email !== findUser.email || password !== findUser.password) {
        throw Error("Email or password are wrong. Try again.")
      }
      
      return res.status(200).json(findUser);
    } catch (error) {
      console.log(error);
    }
  },

   signUp: async (req: Request,  res: Response) => {
     try {
      const { email, username, password } = req.body;
      const existsUserEmail = await prisma.user.findUnique({
        where: { email: email }
      });
      if(existsUserEmail) {
        return res.status(409).json({ message: "User with this email already exists."});
      }
      
      const existsUsername = await prisma.user.findUnique({
        where: { username: username }
      });
      if(existsUsername) {
        return res.status(409).json({ message: "User with this username already exists."});    
      }
      
      const hashedPassword = await hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword
        }
      });
      return res.status(200).json(newUser);
    } catch (error) {
      console.log(error);
    }
  }
}
