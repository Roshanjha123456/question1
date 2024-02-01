import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: true,
  },
  profileImage: {
    url: String,
    publicId: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("User", userSchema);
