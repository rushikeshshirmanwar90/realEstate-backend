import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import postRouter from "./routes/post.route.js";
import AuthRouter from "./routes/auth.route.js";
import testRouter from "./routes/test.route.js";
import userRouter from "./routes/user.route.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/post", postRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/test", testRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to My World");
});

app.listen(3000, () => {
  console.log("server is running on 3000");
});
