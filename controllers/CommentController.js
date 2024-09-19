import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js'

export const create = async (req, res) => {
    try {        
        const doc = new CommentModel({
            post: req.params.id,
            user: req.userId,
            text: req.body.text 
        });  

        const comment = await doc.save();

        await PostModel.findByIdAndUpdate(
            req.params.id,
            
            { $inc: { commentsCount: 1 } }  // Увеличиваем commentsCount на 1
        )

        res.json(
            comment
        );
    } catch (err) {
        console.log(err); 
        res.status(500).json({
            message: "Не удалось создать комментарий"
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const { id: postId } = req.params
        

        // Получаем все комментарии по ID поста
        const comments = await CommentModel.find({post: postId})
            .populate('user', 'avatar fullName') 
            .exec();

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось загрузить комментарии" 
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentId = req.params.idComment; 
        const userId = req.userId;
        
        const comment = await CommentModel.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                message: 'Комментарий не найден',
            });
        }

        if (comment.post.toString() !== postId) {
            return res.status(400).json({
                message: 'Комментарий не относится к этому посту',
            });
        }

        if (comment.user.toString() !== userId && !req.isAdmin) {
            return res.status(403).json({
                message: 'Нет прав на удаление этого комментария',
            });
        }

        await CommentModel.findByIdAndDelete(commentId);

        await PostModel.findByIdAndUpdate(req.params.id, {
            $inc: { commentsCount: -1 },
        });

        res.json({
            success: true,
            message: 'Комментарий удален',
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить комментарий',
        });
    }
};