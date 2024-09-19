import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Неверный формат пароля').isLength({min: 8, max: 50}),
    body('fullName', 'Укажите имя').isLength({min: 2}),
    body('avatar', 'Неверная ссылка на аватарку').optional()
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Неверный формат пароля').isLength({min: 8, max: 50})
] 