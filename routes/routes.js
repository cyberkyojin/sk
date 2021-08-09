const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Posts')
const Posts = mongoose.model('posts')
// require('../models/Users')
const auth = require('../helpers/priv')
// const User = require('../models/Users')

router.get('/home', auth, (req, res) => {
    Posts.find().sort({posted: 'desc'}).lean().then(posts => {
        res.render('home', {posts})
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens.')
        res.redirect('/home')
    })
})

router.get('/profile', (req, res) => {
    res.render('profile')
})

router.get('/search', auth, (req, res) => {
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
