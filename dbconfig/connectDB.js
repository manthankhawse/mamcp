import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("connected to db");
        }).catch((e)=>{
            console.log(e);
        })
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;