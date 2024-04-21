import { PrismaClient } from "@prisma/client";
import { ISignUp } from "./interfaces/SignUp";
import { IUser } from "./interfaces/SignIn";
const prisma = new PrismaClient();

class AuthController {
  signIn = async (data: IUser): Promise<undefined | void> => {
    try {
      console.log(data.email, data.password);
      if(!data.email && !data.password) {
        throw Error(`Both fields are empty!`)
      }
      
      const findUser = await prisma.user.findUnique({ 
        where: {
          email: data.email,
        }
      });
      
      if(!findUser) {
        throw Error("This email doesn't exist.")
      }
    } catch (error) {
      console.log(error);
    }
  }

  signUp = async (data: ISignUp) => {
    try {
      const newUser = await prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          password: data.password,
        },
      });
      return newUser ; 
    } catch (error) {
      console.log(error);
    }
  };
}
