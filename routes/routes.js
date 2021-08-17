const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Posts')
const Posts = mongoose.model('posts')
require('../models/Users')
const auth = require('../helpers/priv')
const User = mongoose.model('users')
require('../models/UsersPub')
const UsersPub = mongoose.model('userspub')

const multer = require('multer')

router.get('/home', auth, (req, res) => {
    Posts.find().sort({posted: 'desc'}).lean().then(posts => {
            res.render('home', {posts})
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens.')
        res.redirect('/home')
    })
})

router.get('/:user', auth, (req, res) => {
    User.findOne({user: req.params.user}).then(user => {
        if(user) {
            Posts.findOne({userId: user._id}).sort({posted: 'desc'}).then(postsU => {
                UsersPub.find({userId: req.user._id}).then(UsersPub => {
                    res.render('profile', {postsU, UsersPub})
                })
            }).catch(err => {
                res.flash('error_msg', 'Erro ao listar as postagens.')
                res.redirect('/home')
            })
        }
        else {
            req.flash('error_msg', 'Usuário inexistente!')
            res.redirect('/home')
        }
    })
})

const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/images')
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
})

const upload = multer({storage})

router.post('/userinfo', auth, upload.single('profpic'), (req, res) => {
    let UsersP = new UsersPub({userId: req.user._id, profPic: req.file.filename, bio: req.body.bio})
    
    UsersP.save().then(() => {
        res.redirect('/' + req.user.user)
    }).catch(err => {console.log('nao sallvo')})

})

router.get('/s/search', auth, (req, res) => {
    Posts.find({post: {$regex: req.query.search, $options: '1'}}).sort({posted: 'desc'}).lean().then(search => {
        res.render('search', {search})
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao buscar.')
        res.redirect('/home')
    })
})

router.post('/home/write', auth, (req, res) => {    
    new Posts({userId: req.user._id, userUser: req.user.user, post: req.body.textarea}).save().then(() => {
        req.flash('success_msg', 'Postagem enviada.')
        res.redirect('/home')
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao enviar a postagem.')
        res.redirect('/home')
    })
})

router.post('/home/delete/:postId/:userId', auth, (req, res) => {
    if(req.params.userId == req.user._id) {
        Posts.deleteOne({_id: req.params.postId}).then(() => {
            req.flash('success_msg', 'Postagem apagada com sucesso.')
            res.redirect('/home')
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro ao deletar a postagem.')
            res.redirect('/home')
        })
    } else {
        req.flash('error_msg', 'Ei! você só pode deletar suas postagens.')
        res.redirect('/home')
    }

})

module.exports = router
