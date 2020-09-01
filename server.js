const express = require('express')
const app = express()

const mongoose = require('mongoose')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')

require('dotenv').config()
require('./passport-config')(passport)

//MongoDB Connection
mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DATABASE CONNECTED'))
    .catch((err) => console.log(err))

//MODElS
const User = require('./models/user')
const Book = require('./models/book')

//ROUTERS
const userRouter = require('./routes/user')
const bookRouter = require('./routes/books')

//SET & USE
app.set('view engine','ejs')
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended:false }))

//SESSION
app.use(flash())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//ROUTES
app.get('/', (req, res) => {
    res.render('index')
})

app.use('/user', userRouter)
app.use('/books', bookRouter)

//LISTEN
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`SERVER IS LIVE AT ${PORT}`))

