const mongoose = require('mongoose')

const UsersPub = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    profPic: {
        type: String,
        default: ''
    },
    
    bio: {
        type: String,
        default: ''
    }
})

mongoose.model('userspub', UsersPub)
