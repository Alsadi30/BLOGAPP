require('dotenv').config()
const express = require('express')
const mongoose  = require('mongoose')
const config = require('config')


const setMiddleware = require('./middleware/middleware')
const setRoutes = require('./routers/routers') 



const app = express()





app.set('view engine','ejs')
app.set('views', 'views')





setMiddleware(app)

setRoutes(app)

app.use((req,res,next) => {
    let error = new Error('404 Page not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render('pages/errorPages/404',{flashMessage:{}})
    }
    return res.render('pages/errorPages/500',{flashMessage:{}})
})


const PORT = process.env.PORT || 8080

mongoose.connect(config.get('db-uri'),{useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>{
    app.listen(PORT,()=>{
        console.log('Server is runnig on PORT ' + PORT)
    })
})
.catch(e=>{
    console.log(e)
})
