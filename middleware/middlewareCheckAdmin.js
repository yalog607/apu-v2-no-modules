const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = {
    checkAdmin: (rank, admin) => {
        return rank === "Quản trị viên" && admin ? true : false
    }
}