import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
    {
        title: {
            type: String,   
            require: true
        },
        text: {
            type: String,
            require: true,
            unique: true
        },
        tags: {
            type: Array,    
            require: true,
            default: []
        }, 
        viewsCount: {
            type: Number,
            default: 0 
        },
        commentsCount: {
            type: Number,
            default: 0 
        },
        user: {    
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            reqired: true
        },
        ImageUrl: {
            type: String,
            default: ''
        }
    }, {
        timestamps: true
    }
)

export default mongoose.model("Post", PostSchema)