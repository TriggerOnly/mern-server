import jwt from 'jsonwebtoken'

export default (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123')

            req.userId = decoded._id
            next()
        } catch (err) {
            console.log(err)
            res.status(400).json({
                message: 'Нет доступа'
            }) 
        }     
    } else {
        res.status(403).json({
            message: 'Нет доступа'
        })
    }
}