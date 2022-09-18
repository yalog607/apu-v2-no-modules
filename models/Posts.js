const mongoose = require('mongoose')

const posts = new mongoose.Schema({
    time: {
        type: String,
    },
    content: {
        type: String,
    },
    loves: {
        type: Number,
    },
    comments: {
        type: Number,
    },
    shares: {
        type: Number,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('posts', posts)