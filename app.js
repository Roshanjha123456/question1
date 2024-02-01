import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

export const app = express();
config({
  path: "./config.env",
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json())

app.use("/api/v1/users", userRouter);
app.use("/api/v1/task", taskRouter);
