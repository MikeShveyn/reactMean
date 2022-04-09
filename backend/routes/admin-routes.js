const express = require('express')
const {check} = require('express-validator')
const adminController = require('../controllers/admin-controller')
const router = express.Router()
const checkAuth = require('../middleware/check-auth')

router.get('/post', adminController.getAdminPost)

router.use(checkAuth)

router.post('/post',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description')
            .isLength({min: 5})
    ],
    adminController.createAdminPost)


router.patch('/post/:postId',
    check('title')
        .not()
        .isEmpty(),
    check('description')
        .isLength({min: 5}),
  adminController.updateAdminPost)


router.delete('/post/:postId', adminController.deleteAdminPost)


module.exports = router;
