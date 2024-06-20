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
import { UserController } from "./app/user/UserController";
import { MessageController } from "./app/message/MessageController";

const authController = new AuthController();
const postController = new PostController();
const communityController = new CommunityController();
const userController = new UserController();
const messageController = new MessageController();
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
    this.useCors();
    this.useUploads();
  }

  listenServer() {
    this.http.listen(3333, () => console.log("Server running on port 3333."));
    this.app.use(express.json());
  }

  listenSocket() {
    this.io.on("connection", (socket) => {
      console.log("user connected =>", socket.id);
      
      socket.on("message", (msg) => {
        this.io.emit("message", msg);
      })
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
    this.app.get("/get/user", userController.getOne);
    // Post CRUD
    this.app.post(  "/new/post",  authMiddleware,  upload.single("image"),  postController.create);
    this.app.get("/get/post", postController.getPostById); 
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
    // Message CRUD
    this.app.post("/new/message", authMiddleware, messageController.create);
    this.app.get("/get/message", messageController.getMessageById);
    this.app.put("/update/message", authMiddleware, messageController.update);
    this.app.delete("/delete/message", authMiddleware, messageController.delete);
    // Get all posts
    this.app.get("/all/posts", authMiddleware, postController.getAll);
    // Get all users
    this.app.get("/all/users", authMiddleware, userController.getAll);
  }
}

const app = new App();
app.listenServer();
app.setupRoutes();