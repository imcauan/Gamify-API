import express from "express";
import cors from "cors";
import path from "path";
import uploadsConfig from "./config/multer"
import multer from "multer";
import { PostController } from "./app/posts/PostController";
import { AuthController } from "./app/auth/AuthController";
import { CommunityController } from "./app/community/CommunityController";
import { UserController } from "./app/user/UserController";
import { CommmentaryController } from "./app/commentary/CommentaryController"; 
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();
const authController = new AuthController();
const postController = new PostController();
const userController = new UserController();
const communityController = new CommunityController();
const commentaryController = new CommmentaryController();
const upload = multer(uploadsConfig);

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}))
app.listen(3333, () => {
    console.log("Server is listening on port 3333");
});

app.post("/user/signin", authController.signIn);
app.post("/user/signup", authController.signUp);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

app.get("/user/me", authMiddleware, userController.getProfile);

// Post CRUD
app.post("/new/post", authMiddleware, upload.single("image"), postController.create);
app.post("/get/post", authMiddleware, postController.getPostById);
app.put("/edit/post/:id", authMiddleware, postController.update);
app.delete("/delete/post/:id", authMiddleware, postController.delete);

// Post Actions
app.post("/new/like", authMiddleware, postController.likePost);
app.post("/new/commentary", authMiddleware, commentaryController.create);
app.put("/edit/commentary/:id", authMiddleware, commentaryController.update);
app.delete("/delete/commentary/:id", authMiddleware, commentaryController.delete);

// Community CRUD
app.post("/new/community", authMiddleware, communityController.create);
app.put("/edit/community/:id", authMiddleware, communityController.update);
app.delete("/delete/community/:id", authMiddleware, communityController.delete);

// Get all posts
app.get("/all/posts", authMiddleware, postController.getAll)
