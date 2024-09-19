import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", 
        reqired: true
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        reqired: true
    },
    text: {
        type: String,
        reqired: true   
    }
});

export default mongoose.model("Comment", CommentSchema);
