import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET!);
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
