import express from "express";
import cors from "cors";

const app = express();
const AuthController = require("../src/app/auth/AuthController");
const UserController = require("../src/app/user/UserController");
const authMiddleware = require("../src/middlewares/authMiddleware");

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}))
app.listen(3333, () => {
    console.log("Server is listening on port 3333");
});

app.post("/user/signin", AuthController.signIn);
app.post("/user/signup", AuthController.signUp);

app.use(authMiddleware);
app.get("/profile", authMiddleware, UserController.getProfile);