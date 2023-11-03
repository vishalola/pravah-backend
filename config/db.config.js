import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
export async function connectDB(){
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("database connected succesfully.");
}


