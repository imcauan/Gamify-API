import express, { Application } from "express";
import http from "http";
import { Server } from "socket.io";
import { AuthController } from "./app/auth/AuthController";
import { PostController } from "./app/posts/PostController";
import { CommunityController } from "./app/community/CommunityController";
import { authMiddleware } from "../src/middlewares/authMiddleware";
import cors from "cors";
import uploadsConfig from "./config/multer";
import multer from "multer";
import path from "path";

const authController = new AuthController();
const postController = new PostController();
const communityController = new CommunityController();
const upload = multer(uploadsConfig);

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;

  constructor() {
    this.app = express();
    this.http = http.createServer(this.app);
    this.io = new Server(this.http);
    this.listenSocket();
    this.setupRoutes();
    this.useCors();
    this.useUploads();
  }

  listenServer() {
    this.http.listen(3333, () => console.log("Server running on port 3333."));
  }

  listenSocket() {
    this.io.on("connection", (socket) => {
      console.log("user connected =>", socket.id);
    });
  }

  useCors() {
    this.app.use(
      cors({
        origin: "http://localhost:3000",
      })
    );
  }

  useUploads() {
    this.app.use(
      "/uploads",
      express.static(path.join(__dirname, "..", "uploads"))
    );
  }

  setupRoutes() {
    this.app.post("/user/signup", authController.signUp);
    this.app.post("/user/signin", authController.signIn);
    this.app.get("/user/me", authMiddleware, authController.getProfile);
    // Post CRUD
    this.app.post(  "/new/post",  authMiddleware,  upload.single("image"),  postController.create);
    this.app.post("/get/post", authMiddleware, postController.getPostById);
    this.app.put("/edit/post/:id", authMiddleware, postController.update);
    this.app.delete("/delete/post/:id", authMiddleware, postController.delete);
    // Post Actions
    this.app.post("/new/like", authMiddleware, postController.likePost);
    this.app.post("/new/commentary", authMiddleware, postController.createCommentary);
    this.app.post("/save/post", authMiddleware, postController.savePost);
    this.app.put("/edit/commentary/:id", authMiddleware, postController.updateCommentary);
    this.app.delete("/delete/commentary/:id", authMiddleware, postController.deleteCommentary);
    // Community CRUD
    this.app.post("/new/community", authMiddleware, communityController.create);
    this.app.put("/edit/community/:id", authMiddleware, communityController.update);
    this.app.delete("/delete/community/:id", authMiddleware, communityController.delete);
    // Get all posts
    this.app.get("/all/posts", authMiddleware, postController.getAll);
  }
}

const app = new App();
app.listenServer();