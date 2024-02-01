import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const isAuthentiCated = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "login first",
    });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.user = await User.findById(decoded._id);
  next();
};
