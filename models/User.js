const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        minLength: 5,
        required: true,
        trim: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    rank: {
        type: Number,
        default: 0,
    },
    capbac: {
        type: String,
        default: 'Thành viên'
    },
    totalMoney: {
        type: Number,
    },
    totalBank: {
        type: Number,
    },
    totalUsed: {
        type: Number,
    },
    content: {
        type: String,
    },
    block: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)