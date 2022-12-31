const User = require('../models/User')
const jwt = require('jsonwebtoken')

module.exports = {
    checkAdmin: (admin) => {
        return admin ? true : false
    }
}