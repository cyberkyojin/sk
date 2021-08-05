const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('../models/Users')
const Users = mongoose.model('users')
const passport = require('passport')

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
                res.redirect('/u/signup')
            } else {
                const newUser = new Users({
                    user: req.body.user,
                    password: req.body.pass
                })
                let pass = bcrypt.hashSync(newUser.password)

                newUser.password = pass

                newUser.save().then(() => {
                    req.flash('success_msg', 'cadastrado com sucesso')
                    res.redirect('/u/login')
                }).catch(err => {
                    req.flash('error_msg', 'nao cadastrado', err)
                    res.redirect('/u/signup')
                })  

            }
        })      
    }
})

router.get('/login', (req, res) => {
    if(req.query.fail) {
        res.render('login', {message: 'Usuário e/ou senha inválidos.'})
    } else {
        res.render('login', {message: null})
    }
    
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/u/login',
        failureFlash: true
    })(req, res, next)
}) 

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Deslogado.')
    res.redirect('/u/login')
})

module.exports = router