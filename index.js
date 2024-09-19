import express from 'express'
import mongoose from 'mongoose'
import {registerValidation, loginValidation} from './validations/AuthValidation.js'
import { postCreateValidation } from './validations/PostValidation.js'
import checkAuth from './utils/ChechAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import * as CommentController from './controllers/CommentController.js'
import ChechAuth from './utils/ChechAuth.js'
import multer from 'multer'
import cors from 'cors'
import HandleValidationErrors from './utils/HandleValidationErrors.js'
import { check } from 'express-validator'

mongoose
    .connect('mongodb+srv://Trigger:TheTrigger1911@cluster01.pdqy6.mongodb.net/portfolio?retryWrites=true&w=majority&appName=Cluster01')
    .then(() => console.log('Connected'))
    .catch((err) => console.log("Error with database", err))

const app = express()   
const storage = multer.diskStorage({
    destination: (_, __, cd) => {
        cd(null, 'upload')
    },
    filename: (_, file, cd) => {
        cd(null, file.originalname)
    }
})

const upload = multer({storage})

app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.use('/upload', express.static('upload'))

//user
app.post('/login', loginValidation, HandleValidationErrors, UserController.login)
app.post('/register', registerValidation, HandleValidationErrors, UserController.register)
app.get('/login/me', checkAuth, UserController.getMe)

//posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', ChechAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)

//comments
app.post('/posts/:id', checkAuth, CommentController.create)
app.get('/posts/:id/comments', CommentController.getAll)
app.delete('/posts/:id/comments/:idComment', checkAuth, CommentController.remove);


//tags
app.get('/posts/tags',  PostController.getLastTags)
app.get('/tags', PostController.getLastTags)

app.post('/upload', upload.single('image'), (req, res) => {
    
    if (!req.file) { 
        return res.status(400).json({ message: 'Файл не был загружен' });
    }

    res.json({
        url: `upload/${req.file.originalname}`,
    });
});


app.listen(4444, (err) => { 
    if (err) {
        return console.log(err); 
    }
})  