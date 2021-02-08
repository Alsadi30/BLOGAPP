const  router = require('express').Router()
const signupValidator = require('../validator/auth/signupValidator')
const loginValidator = require('../validator/auth/loginValidator')


const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPosttController,
    logoutController
} = require('../controllers/authController')





router.get('/signup',signupGetController)
router.post('/signup',signupValidator,signupPostController)

router.get('/login',loginGetController)
router.post('/login',loginValidator,loginPosttController)

router.get('/logout',logoutController)


module.exports = router