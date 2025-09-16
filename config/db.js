import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config()

const MONGO_URI = process.env.MONGO_URI
const connectDB = async() => {
    try{
        const conn = await mongoose.connect(MONGO_URI, { dbName:'CRUD'})
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.error(`MongoDB Connection Error: ${error.message}`);        
    }
}

export default connectDB