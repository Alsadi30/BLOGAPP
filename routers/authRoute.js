const  router = require('express').Router()
const signupValidator = require('../validator/auth/signupValidator')
const loginValidator = require('../validator/auth/loginValidator')


const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPosttController,
    logoutController,
    changePasswordGetController,
    changePasswordPostController
} = require('../controllers/authController')

const {isAuthenticated} = require('../middleware/authMiddleware')
 


router.get('/signup',signupGetController)
router.post('/signup',signupValidator,signupPostController)

router.get('/login',loginGetController)
router.post('/login',loginValidator,loginPosttController)

router.get('/logout',logoutController)

router.get('/change-password',isAuthenticated,changePasswordGetController)
router.post('/change-password',isAuthenticated,changePasswordPostController)

module.exports = router