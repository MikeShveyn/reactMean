const HttpError = require('../models/http-error')
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1] //'Bearer TOKEN'
        if(!token) {
            throw new Error('Authentication failed')
        }
        const decoded = jwt.verify(token, 'best_key')
        req.userData = {userId : decoded.userId};
        next();
    }catch (e) {
        const error = new HttpError('Authentication failed', 403);
        return next(error)
    }
}