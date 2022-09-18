const jwt = require('jsonwebtoken');
const User = require('../models/User')

const middlewareCheckToken = {
    checkTokenWhenGoHome: (req, res, next) => {
        try {
            var token = req.cookies.token;
            var result = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            User.findOne({_id: result.id})
                .then(user => {
                    if (user.block == 1) {
                        res.send('Tài khoản của bạn đã bị khóa');
                    }else if (result) {
                        next();
                    }
                })
                .catch(err => console.log("Lỗi token & database"));
        } catch (error) {
            res.redirect('/auth/login');
        }
    },
    checkTokenWhenGoAuth: (req, res, next) => {
        try {
            var token = req.cookies.token;
            var result = jwt.verify(token, process.env.JWT_ACCESS_KEY);
            if (result) {
                res.redirect('/home');
            }
        } catch (error) {
            next();
        }
    }
}

module.exports = middlewareCheckToken
