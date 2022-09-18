const User = require('../models/User')
const siteLog = require('../models/SiteLog')
const Config = require('../models/Config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

let refreshTokens = []
const authController = {
    // Render auth
    renderLogin: (req, res, next) => {
        res.render('auth/signin', {
            success: req.flash('success'),
            done: req.flash('done'),
            error: req.flash('error'),
            logout: req.flash('logout')
        })
    },
    renderRegister: (req, res, next) => {
        res.render('auth/signup', {
            error: req.flash('error')
        })
    },
    renderForgotPassword: (req, res, next) => {
        res.render('auth/forgotPass')
    },

    // --- Handle events ---
    registerUser: async(req, res) => {
        try {
            Config.findOne({})
                .then(async(config) => {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
                    // Create new user
                    const newUser = await new User({
                        fullname: req.body.fullname,
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword,
                        rank: 0,
                        totalMoney: 0,
                        totalBank: 0,
                        totalUsed: 0,
                        content: `${config.cuphap} ${req.body.username}`
                    })

                    if (!req.body.fullname) {
                        req.flash("error", "Trường họ và tên không được bỏ trống!")
                        return res.redirect('/auth/register')
                    }
                    if (!req.body.email) {
                        req.flash("error", "Trường email không được bỏ trống!")
                        return res.redirect('/auth/register')
                    }
                    if (!req.body.username) {
                        req.flash("error", "Trường tài khoản không được bỏ trống!")
                        return res.redirect('/auth/register')
                    }
                    if (!req.body.password) {
                        req.flash("error", "Trường mật khẩu không được bỏ trống!")
                        return res.redirect('/auth/register')
                    }

                    if (req.body.username.length < 5 ) {
                        req.flash("error", "Trường tài khoản phải tối thiểu 5 kí tự!")
                        return res.redirect('/auth/register')
                    }
                    if (req.body.password.length < 5 ) {
                        req.flash("error", "Trường mật khẩu phải tối thiểu 5 kí tự!")
                        return res.redirect('/auth/register')
                    }
        
                    const usernameOld = await User.findOne({username: req.body.username})
                    if (usernameOld) {
                        req.flash("error", "Username đã tồn tại trên hệ thống")
                        return res.redirect('/auth/register')
                    }
        
                    const emailOld = await User.findOne({email: req.body.email})
                    if (emailOld) {
                        req.flash("error", "Email đã tồn tại trên hệ thống")
                        return res.redirect('/auth/register')
                    }
        
                    var IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                    const d = new Date();
                    var year = d.getFullYear();
                    var month = d.getMonth() + 1;
                    var day = d.getDate();
                    var hour = d.getHours();
                    var minute = d.getMinutes();
                    var second = d.getSeconds();
        
                    var time = `${year}-${month}-${day} ${hour}:${minute}:${second}`
                    //Update site log
                    const newLog = await new siteLog({
                        name: req.body.username,
                        content: `Đã đăng kí tài khoản tại ${IP}`,
                        time: time,
                        ip: IP
                    })

                    // Save to database
                    const user = await newUser.save()
                    const log = await newLog.save()

                    req.flash("success", "Đăng kí tài khoản thành công")
                    res.clearCookie('token')
                    return res.redirect('/auth/login')
                })
                .catch(err => {
                    console.log('Lỗi database')
                })
        } catch (error) {
            return res.status(500).json(error)
        }
    },

    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id
        }, process.env.JWT_ACCESS_KEY, {
            expiresIn: '2h'
        })
    },

    // GENERATE REFRESH TOKEN
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin
        }, process.env.JWT_REFRESH_KEY, {
            expiresIn: '365d'
        })
    },

    // Login
    loginUser: async(req, res) => {
        try {
            const user = await User.findOne({username: req.body.username})
            if(!req.body.username) {
                req.flash("error", "Trường tài khoản không được bỏ trống!")
                return res.redirect('/auth/login')
            }
            if(req.body.username.length < 5) {
                req.flash("error", "Trường tài khoản phải tối thiểu 5 kí tự!")
                return res.redirect('/auth/login')
            }
            if(!user) {
                req.flash("error", "Tài khoản không tồn tài trên hệ thống!")
                return res.redirect('/auth/login')
            }
            if(!req.body.password) {
                req.flash("error", "Trường mật khẩu không được bỏ trống!")
                return res.redirect('/auth/login')
            }
            if(req.body.password.length < 5) {
                req.flash("error", "Trường mật khẩu phải tối thiểu 5 kí tự!")
                return res.redirect('/auth/login')
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(!validPassword) {
                req.flash("error", "Sai mật khẩu đăng nhập, hãy kiểm tra lại!")
                return res.redirect('/auth/login')
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user)
                const refreshToken = authController.generateRefreshToken(user)
                refreshTokens.push(refreshToken)
                const {password, ...others} = user._doc
                const data = {accessToken, ...others}
                res.clearCookie('username')
                res.clearCookie('token')
                res.cookie("token" /* refreshToken */, accessToken /* refreshToken */, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                res.cookie("tokenAPI" /* refreshToken */, refreshToken /* /* refreshToken */, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })

                var IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const d = new Date();
                var year = d.getFullYear();
                var month = d.getMonth() + 1;
                var day = d.getDate();
                var hour = d.getHours();
                var minute = d.getMinutes();
                var second = d.getSeconds();

                var time = `${year}-${month}-${day} ${hour}:${minute}:${second}`
                //Update site log
                const newLog = await new siteLog({
                    name: user.username,
                    content: `Đã đăng nhập tài khoản tại ${IP}`,
                    time: time,
                    ip: IP
                })
                // Save to database
                const log = await newLog.save()

                setTimeout(() => {
                    req.flash("success", "Đăng nhập thành công!")
                    return res.redirect('/home')
                },340)
            }
        } catch (error) {
            res.json(error)
        }
    },
    requestRefreshToken: (req, res) => {
        // Take refresh token from user
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(401).json('You\'re not authenticated')
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json('Refresh token is not valid')
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if(err) {
                console.log(err)
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
            // Create a new tokens
            const newAccessToken = authController.generateAccessToken(user)
            const newRefreshToken = authController.generateRefreshToken(user)
            refreshTokens.push(newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            return res.status(200).json({accessToken: newAccessToken})
        })
    },
    changePassUser: async(req, res) => {
        try {
            const new_password = await req.body.password;
            const userData = await jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(new_password, salt);

            const user = await User.findOne({_id: userData.id});
            const oldPassword = req.body.old_password;
            const confirm_new_password = req.body.confirm_password;
            const validPassword = await bcrypt.compare(
                oldPassword,
                user.password
            )
            const timeMs = 2000;
            const time = timeMs / 1000;
            if (!req.body.old_password) {
                req.flash('msg', `Trường mật khẩu cũ không được bỏ trống`)
                return res.redirect('/profile/info')
            }if (!req.body.password) {
                req.flash('msg', `Trường mật khẩu mới không được bỏ trống.`)
                return res.redirect('/profile/info')
            }if (!req.body.confirm_password) {
                req.flash('msg', `Trường nhập lại mật khẩu mới không được bỏ trống.`)
                return res.redirect('/profile/info')
            }

            if (!validPassword) {
                req.flash('msg', `Mật khẩu cũ không chính xác, vui lòng thử lại sau ${time}s`)
                return res.redirect('/profile/info')
            }
            if (new_password.length < 5) {
                req.flash('msg', `Mật khẩu mới phải tối thiểu 5 kí tự`)
                return res.redirect('/profile/info')
            }
            if (new_password !== confirm_new_password) {
                req.flash('msg', `Mật khẩu nhập lại không chính xác`)
                return res.redirect('/profile/info')
            }
            
            User.updateOne({_id: userData.id}, {password: hashedPassword})
                .then(() => {
                    req.flash('done', 'Đổi mật khẩu thành công')
                    res.clearCookie('token')
                    res.redirect('/auth/login')
                })
                .catch((err) => {
                    console.log(err)
                    res.clearCookie('token')
                    res.redirect('/auth/login')
                })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    
    // Logout
    logoutUser: (req, res, next) => {
        res.clearCookie('token')
        res.clearCookie('tokenAPI')
        req.flash('logout', `Đã đăng xuất!`)
        return res.redirect('/auth/login')
    }
}

module.exports = authController;
