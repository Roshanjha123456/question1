import express from "express";
import { isAuthentiCated } from "../middlewares/auth.js";
import { verifyToken } from "../controllers/user.js";
import { getAllusers, login, register, logOut } from "../controllers/user.js";
import { getSingleUser } from "../controllers/user.js";
import { upload } from "../middlewares/image-uploader.js";

const router = express.Router();
router.get("/", isAuthentiCated, getAllusers);
router.post("/login", login);
router.post("/register", upload.single("image"), register);
router.get("/logOut", logOut);
router.get("/verify", verifyToken);
router.get("/me", getSingleUser)

export default router;
