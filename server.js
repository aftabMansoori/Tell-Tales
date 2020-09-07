const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const auth = require('./config/auth')

const app = express()

//MODELS
const User = require('./models/user')
const Book = require('./models/book')

//ROUTERS
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const bookRouter = require('./routes/books')
const user = require('./models/user')

require('dotenv').config()
require('./config/passport-config')(passport)

//SET & USE
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

//DATABASE CONNECTION
const mongoose = require('mongoose')
const { ensureAuthenticate } = require('./config/auth')
mongoose
.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Database connected...'))
    .catch((err) => console.log(err))

//SESSION
app.use(flash())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//GLOBAL VARS
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.created_msg = req.flash('created_msg')
    res.locals.yours_msg = req.flash('yours_msg')
    res.locals.req = req   
    next()
})

//ROUTES
app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/book', bookRouter)

//LISTEN
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is Live at ${PORT}`)
})