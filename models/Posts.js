const mongoose = require('mongoose')

const Posts = new mongoose.Schema({
    post: {
        type: String,
        required: true
    },

    posted: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('posts', Posts)
