import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function connectDb() {
  mongoose.connect(process.env.MONGO_CONNECTION_URL);
  const connection = mongoose.connection;
  connection.once("open", () => {
    console.log("db is connected");
  });
}
