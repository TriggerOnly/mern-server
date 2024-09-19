import PostModel from '../models/Post.js'
import mongoose from 'mongoose'

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags.split(','),
            ImageUrl: req.body.imageUrl,
            user: req.userId
        })

        const post = await doc.save() 
        
        res.json(
            post
        ) 
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}

export const getOne = async (req, res) =>  {
    try {
        const postId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({
                message: 'Некорректный формат ID',
            });
        }

        const postUpdate = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        ).populate('user')

        if (!postUpdate) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(postUpdate);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Ошибка при получении статьи',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const tag = req.query.tag; 
        
        const query = tag ? { tags: tag } : {};
        
        const posts = await PostModel.find(query)
            .populate('user', '-passwordHash')
            .exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось загрузить список статей',
        });
    }
};


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        
        const postDelete = await PostModel.findOneAndDelete({ _id: postId });
 
        if (!postDelete) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json({
            postDelete,
            message: 'Статья удалена'
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id
        const postUpdate = await PostModel.updateOne(
            {_id: postId},
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(',')
            }
        ) 

        res.json({
            postUpdate,
            success: true
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось сохранить изменения'
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = [...new Set(posts.map((obj) => obj.tags).flat())].slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Тэги не найдены',
        });
    }
};



