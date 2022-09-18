const User = require('../models/User')
const siteLog = require('../models/SiteLog')
const Config = require('../models/Config')
const jwt = require('jsonwebtoken')
const {checkAdmin} = require('../middleware/middlewareCheckAdmin')

const profileController = {
    renderInfo: (req, res, next) => {
        const userData = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
        const tokenAPI = req.cookies.tokenAPI;
        User.findOne({_id: userData.id})
            .then((user) => {
                const numberFormatter = Intl.NumberFormat('en-US');
                const totalMoney = numberFormatter.format(user.totalMoney);
                const totalBank = numberFormatter.format(user.totalBank);
                const totalUsed = numberFormatter.format(user.totalUsed);
                var rank;
                if (user.rank === 4) {
                    rank = "Quản trị viên"
                } else if (user.rank === 1) {
                    rank = "Cộng tác viên"
                }else if (user.rank === 2) {
                    rank = "Đại lý"
                }else if (user.rank === 3) {
                    rank = "Nhà phân phối"
                }else {
                   rank = "Thành viên"
                }
                
                siteLog.find({name: user.username})
                    .then(data => {
                        setTimeout(() => {
                            const GMT = user.createdAt.toGMTString();
                            res.render('profile/info', {user, GMT, msg: req.flash('msg'), totalMoney, totalBank, totalUsed, rank, tokenAPI, validAdmin: checkAdmin(rank, user.admin), data: data.reverse()})
                        }, 150)
                    })
                    .catch(err => {
                        res.clearCookie('token')
                        res.redirect('/auth/login')
                    })

            })
            .catch((err) => {
                res.clearCookie('token')
                res.redirect('/auth/login')
            })
    },
    renderUpgradeLevel: (req, res, next) => {
        const userData = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
        const tokenAPI = req.cookies.tokenAPI;
        User.findOne({_id: userData.id})
            .then((user) => {
                const numberFormatter = Intl.NumberFormat('en-US');
                totalMoney = numberFormatter.format(user.totalMoney);
                var rank;
                if (user.rank === 4) {
                    rank = "Quản trị viên"
                } else if (user.rank === 1) {
                    rank = "Cộng tác viên"
                }else if (user.rank === 2) {
                    rank = "Đại lý"
                }else if (user.rank === 3) {
                    rank = "Nhà phân phối"
                }else {
                   rank = "Thành viên"
                }

                siteLog.find({name: user.username})
                    .then(data => {
                        Config.findOne({})
                            .then(config => {
                                const numberFormatter = Intl.NumberFormat('en-US');
                                const ratectv = numberFormatter.format(config.ratectv);
                                const ratedaily = numberFormatter.format(config.ratedaily);
                                const ratenhaphanphoi = numberFormatter.format(config.ratenhaphanphoi);
                                setTimeout(() => {
                                    res.render('profile/upgrade', {user, ratectv, ratedaily, ratenhaphanphoi, config, totalMoney, rank, tokenAPI, validAdmin: checkAdmin(rank, user.admin), data})
                                }, 150)
                            })
                            .catch(err => {
                                console.log('Lỗi database')
                            })
                    })
                    .catch(err => {
                        res.clearCookie('token')
                        res.redirect('/auth/login')
                    })

            })
            .catch((err) => {
                res.clearCookie('token')
                res.redirect('/auth/login')
            })
    }
}

module.exports = profileController;
