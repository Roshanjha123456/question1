import express from "express";
import { addTask, getAlltask } from "../controllers/task.js";
import { isAuthentiCated } from "../middlewares/auth.js";
import { deleteTask } from "../controllers/task.js";

const router = express.Router();

router.post("/addTask", isAuthentiCated, addTask);

router.get("/getAlltask", isAuthentiCated, getAlltask);

router.delete("/deleteTask", isAuthentiCated, deleteTask);

export default router;
