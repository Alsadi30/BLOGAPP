const bcrypt = require('bcrypt')
const {
    validationResult
} = require('express-validator')
const Flash = require('../utils/Flash')
const User = require('../models/user')
const errorFormatter = require('../utils/validationErrorFormater')

exports.signupGetController = (req, res, next) => {

    if (req.session.isLoggedIn) {
        res.redirect('/dashboard')
    } else {
        console.log(req.session)
        res.render('pages/auth/signup', {
            title: 'Create An Account',
            error: {},
            value: {},
            flashMessage: Flash.getMessage(req)
        })
    }


}

exports.signupPostController = async (req, res, next) => {

    let {
        username,
        email,
        password
    } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)

   
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Provide valid credential')
        console.log({
            error: errors.mapped()
        })
        return res.render('pages/auth/signup', {
            title: 'Create An Account',
            error: errors.mapped(),
            value: {
                username,
                email,
                password
            },
            flashMessage: Flash.getMessage(req)
        })

    }







    try {
        let hashedPassword = await bcrypt.hash(password, 11)


        let user = new User({
            username,
            email,
            password: hashedPassword
        })


        await user.save()
        req.flash('success','User created  sussessfully')
        res.redirect('/dashboard')
    } catch (e) {
        console.log(e)
        next(e)
    }

    // res.render('pages/auth/signup',{title:'CREATE AN ACCOUNT'})
}

exports.loginGetController = (req, res, next) => {

    if (req.session.isLoggedIn) {
        res.redirect('/dashboard')
    } else {

        res.render('pages/auth/login', {
            title: 'Login to your account',
            error: {},
            flashMessage: Flash.getMessage(req)
        })
    }
}

exports.loginPosttController = async (req, res, next) => {
    let {
        email,
        password
    } = req.body




    let errors = validationResult(req).formatWith(errorFormatter)


    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check your  form')
        return res.render('pages/auth/login', {
            title: 'Login to your account',
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req)
        })
    }



    try {
        let user = await User.findOne({
            email
        })
    
        if (!user) {
            req.flash('fail', 'Please Provide valid credential')
            return res.render('pages/auth/login', {
                title: 'Login to your account',
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }


        let match = await bcrypt.compare(password, user.password)
       
        if (!match) {
            req.flash('fail', 'Please Provide valid credential')
            return res.render('pages/auth/login', {
                title: 'Login to your account',
                error: {},
                flashMessage: Flash.getMessage(req)
            })
        }
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
            if (err) {
                console.log(err)
                return next(err)
            }
            req.flash('success', 'Succussfully loggedin')
            res.redirect('/dashboard')
        })

    } catch (e) {
        console.log(e)
        next(e)
    }

}

exports.logoutController = (req, res, next) => {
   
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            return next(err)
        }
        // req.flash(
        //     'success', 'Succussfully logout'
        // )
        return res.redirect('/auth/login')
       
    })
}