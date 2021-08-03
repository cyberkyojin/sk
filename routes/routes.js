const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Posts')
const Posts = mongoose.model('posts')
require('../models/Users')
const Users = mongoose.model('users')
const jwt = require('jsonwebtoken')

router.get('/home', (req, res) => {
    Posts.find().sort({posted: 'desc'}).lean().then(posts => {
        res.render('home', {posts})
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens.')
        res.redirect('/home')
    })
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', (req, res) => {
    let error = []

    if(!req.body.user) {
        error.push({err: 'Usuario inválido'})
    }

    if(req.body.user.length < 4) {
        error.push({err: 'Usuario muito curto.'})
    }

    if(!req.body.pass) {
        error.push({err: 'Senha inválida.'})
    }

    if(req.body.pass.length < 4) {
        error.push({err: 'Senha muito curta.'})
    }

    if(req.body.pass != req.body.pass2) {
        error.push({err: 'Senhas diferentes.'})
    }

    if(error.length > 0) {
        res.render('signup', {error})
    } else {           
        Users.findOne({user: req.body.user}).then(userU => {
            if(userU) {
                req.flash('error_msg', 'Usuario já cadastrado')
                res.redirect('/signup')
            } else {
                new Users({
                    user: req.body.user,
                    password: req.body.pass
                }).save().then(() => {
                    req.flash('success_msg', 'cadastrado com sucesso')
                    res.redirect('/home')
                }).catch(err => {
                    req.flash('error_msg', 'nao cadastrado', err)
                    res.redirect('/signup')
                })                
            }
        })      
    }
})

router.get('/search', (req, res) => {
    Posts.find({post: {$regex: req.query.search, $options: '1'}}).sort({posted: 'desc'}).lean().then(search => {
        res.render('search', {search})
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro na busca.')
        res.redirect('/home')
    })
})

router.post('/home/write', (req, res) => {
    new Posts({post: req.body.textarea}).save().then(() => {
        req.flash('success_msg', 'Postagem enviada.')
        res.redirect('/home')
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao enviar a postagem.')
        res.redirect('/home')
    })
})

router.post('/home/delete/:id', (req, res) => {
    Posts.deleteOne({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Postagem apagada com sucesso.')
        res.redirect('/home')
    }).catch(err => {
        req.flash('error_msg', 'Houve um erro ao deletar a postagem.')
        res.redirect('/home')
    })
})

module.exports = router
