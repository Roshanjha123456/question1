import mongoose from "mongoose";

const dbName = "testing";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName,
    })
    .then(() => {
      console.log("connected DB");
    })
    .catch((error) => {
      console.log(error);
    });
};

