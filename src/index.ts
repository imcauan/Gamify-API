import app from "./server"
const AuthController = require("../src/app/auth/AuthController");

app.listen("3000", () => {
    console.log("Server is listening on port 3000");
});

app.get("/auth/signin", AuthController.signIn);
app.post("/auth/signup", AuthController.signUp);