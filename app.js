const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

mongoose.connect('mongodb://localhost:27017/sk', {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {console.log('mongoose connected')}).catch(err => {console.log('mongoose not connected')})

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(session({
    secret: 'sksecret',
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

app.use('/', routes)

app.get('/', (req, res) => {res.redirect('/home')})

const port = 8888
app.listen(port, () => {console.log('server running...')})
