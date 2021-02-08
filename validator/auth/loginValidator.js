const {body} = require('express-validator')



module.exports = [
    body('email')
         .not().isEmpty().withMessage("Email Can Not be Empty"),
     body('password')
         .not().isEmpty().withMessage("password Can Not be Empty")     
]