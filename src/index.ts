import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();
const AuthController = require("../src/app/auth/AuthController");

app.use(express.json());
app.listen(3001, () => {
    console.log("Server is listening on port 3001");
});

app.get("/auth/signin", AuthController.signIn);
app.post("/auth/signup", AuthController.signUp);