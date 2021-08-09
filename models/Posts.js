const mongoose = require('mongoose')

const Posts = new mongoose.Schema({
    userId : {
        type: String,
        required: true
    },
    
    userUser: {
        type: String,
        required: true
    },
    
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
