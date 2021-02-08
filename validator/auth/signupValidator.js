const {
    body
} = require('express-validator')
const User = require('../../models/user')

const signupValidator = [
    body('username')
    .isLength({
        min: 2,
        max: 15
    }).withMessage('Username Must Be Between 2 to 15 Charecter')
    .custom(async username => {
        let user = await User.findOne({
            username
        })
        if (user) {
            return Promise.reject('Username Already Used')
        }

    })
    .trim(),
    body('email')
    .isEmail().withMessage('Please Provide A Valid Email')
    .custom(async email => {
        let user = await User.findOne({
            email
        })
        if (user) {
            return Promise.reject('Email Already Used')
        }
        return true
    })
    .normalizeEmail(),
    body('password')
    .isLength({
        min: 5
    }).withMessage('Your Password Must Be Greater Than 5 Chars'),

    body('confirmPassword')
    .custom((confirmPassword, {
        req
    }) => {
        if (confirmPassword !== req.body.password) {
            throw new Error('Password Does Not Match')
        }
        return true
    })

]

module.exports = signupValidator