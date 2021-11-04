const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('../models/Users')
const User = mongoose.model('users')

module.exports = function(passport) {
   passport.use(new localStrategy({usernameField: 'user', passwordField: 'pass'}, (user, pass, done) => {
       User.findOne({user: user}).then(user => {
           if(!user) {
               return done(null, false, {message: 'Usuário não encontrado.'})
           }

           bcrypt.compare(pass, user.password, (error, ok) => {
               if(ok){
                   return done(null, user)
               } else {
                   return done(null, false, {message: 'Senha incorreta.'})
               }
           })
       }) 
   }))

   passport.serializeUser((user, done) => {
       done(null, user.id)
   })

   passport.deserializeUser((id, done) => {
       User.findById(id, (err, user) => {
           done(err, user)
       })
   })

}