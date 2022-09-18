const mongoose = require('mongoose')

const Bank = new mongoose.Schema({
    type: {
        type: String,
    },
    img: {
        type: String,
    },
    stk: {
        type: String,
    },
    ctk: {
        type: String,
    },
    naptoithieu: {
        type: String,
    },
    note: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Bank', Bank)