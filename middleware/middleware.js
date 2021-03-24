const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session)
const config = require('config')

const {bindUserWithRequest} = require('./authMiddleware')
const setLocals = require('./setLocal')



const MONGODB_URI = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@blog-1.zkv8i.mongodb.net/BLOG-1?retryWrites=true&w=majority`

const store = new MongoDBStore({
    uri: MONGODB_URI, 
    collection: 'sessions',
    expires:100*60*60*2
})



const middleware = [ 
    morgan('dev'),
    express.static('public'),
    express.urlencoded({extended:true}),
    express.json(),
    session({
        secret:config.get('secret'),
        resave:false,
        saveUninitialized:false,
        store:store
    }),
    flash(),
    bindUserWithRequest(),
    setLocals()
   
     
]

module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}