const mongoose = require('mongoose')

const User = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

mongoose.model('users', User)
