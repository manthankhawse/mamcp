import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        required: true
    },
    sender:{
        type:Number,
        required: true
    }
},{
    timestamps:true
})

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;