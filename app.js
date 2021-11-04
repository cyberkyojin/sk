const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const user = require('./routes/user')
const passport = require('passport')
require('./settings/auth')(passport)
//const multer = require('multer')
const path = require('path')

mongoose.connect("mongodb connection", {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {console.log('mongoose connected')}).catch(err => {console.log('mongoose not connected')})

app.engine('handlebars', exphbs({defaultLayout: 'main', runtimeOptions: {allowProtoPropertiesByDefault: true,allowProtoMethodsByDefault: true,}}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(session({
    secret: 'sksecret',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(express.static(path.join(__dirname+'/public')))

// const storage = multer.diskStorage({
//         destination: function(req, file, cb) {
//             cb(null, 'models/Pics/')
//         },
//         filename: function(req, file, cb) {
//             cb(null, file.originalname)
//         }
// })

// const upload = multer({storage})

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

app.use('/', routes)
app.use('/u', user)

app.get('/', (req, res) => {res.redirect('/home')})

const port = 8888
app.listen(port, () => {console.log('server running...')})
