import express, { Router } from "express";
import cors from "cors";

const app = express();
const AuthController = require("../src/app/auth/AuthController");
const UserController = require("../src/app/user/UserController");
const PostController = require("../src/app/posts/PostController")
const CommunityController = require("../src/app/community/CommunityController");
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

app.use(() => authMiddleware)
app.get("/user/me", UserController.getProfile);

app.post("/new/post", PostController.create);
app.put("/post/:id", PostController.update);
app.delete("/delete/post/:id", PostController.delete);

app.post("/new/community", CommunityController.create);
app.put("/community/:id", CommunityController.update);
app.delete("/delete/community/:id", CommunityController.delete);
