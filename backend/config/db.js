import mongoose from "mongoose";

const connectDb = async(req, res)=>{
     try{
          let conn = await mongoose.connect(process.env.MONGODB_URI);
          console.log(`Connected to db at ${conn.connection.host}`);
     }catch(err){
          console.log(`Error connected to db`, err.message);
     }
}

export default connectDb;