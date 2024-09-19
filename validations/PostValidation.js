import {body} from 'express-validator'

export const postCreateValidation = [
    body('title', 'Введите заголовок').isString(),
    body('text', 'Введите текст статьи').isString(),
    body('tags', 'Неверный формат тэгов').optional().isString().isArray({max: 3}).withMessage('Должно быть не более 3 тэгов'),
    body('avatarUrl', 'Неверная ссылка на изображение').optional().isString(),
]