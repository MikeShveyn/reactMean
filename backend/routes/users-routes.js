const express = require('express');
const {check} = require('express-validator')

const usersControllers = require('../controllers/user-controller');

const router = express.Router();

// Order matters !!!

router.get('/', usersControllers.getUsers)

router.post('/signup' ,
    check('name')
        .not()
        .isEmpty(),
    check('email')
        .normalizeEmail()
        .isEmail(),
    check('password')
        .isLength({min:5})
    , usersControllers.signup)

router.post('/login', usersControllers.login)


module.exports = router;