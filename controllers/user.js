import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import validator from "validator";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dgweymmpf",
  api_key: "832516388658461",
  api_secret: "oWr5ySbaa9TMwV3MGWJ4_vO6wzM",
});

export const getAllusers = async (req, res) => {
  try {
    res.send({
      success: true,
      message: "data fetch Successful",
    });
  } catch (error) {
    res.send({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(501).json({ message: "All feilds are mandatory" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }
  sendCookie(user, res, `welcome user ${user.name}`, 200);
};

export const logOut = (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", { expires: new Date(Date.now()) })
      .json({
        success: true,
        message: "logout User",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jha8447632759@gmail.com",
    pass: "eoetanfzuagpzpya",
  },
});

export const register = async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are mandatory" });
  }
  let user = await User.findOne({ email });
  if (user) {
    return res.status(404).json({
      success: false,
      message: "User Already Exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = bcrypt.hashSync(email, 10);
  const imageResult = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "auto",
  });

  user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    profileImage: {
      url: imageResult.secure_url,
      publicId: imageResult.public_id,
    },
  });
  const verificationLink = `${process.env.VERIFICATION_LINK}=${verificationToken}`;
  const mailOptions = {
    from: "jha8447632759@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Click on the following link to verify your email: ${verificationLink}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Error sending verification email" });
    }
    console.log("Email sent: " + info.response);
  });
  sendCookie(
    user,
    res,
    "Registration Successful. Please check your email for verification.",
    201
  );
};

export const verifyToken = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid verification token" });
    }
    if (user.verified) {
      return res
        .status(200)
        .json({ success: true, message: "User already verified" });
    }
    user.verified = true;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "User successfully verified" });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const id = req.query.id;
    const data = await User.findById(id);
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User found",
      user: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
