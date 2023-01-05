const User = require('../models/User')
const siteLog = require('../models/SiteLog')
const jwt = require('jsonwebtoken')
const {checkAdmin} = require('../middleware/middlewareCheckAdmin')
const Config = require('../models/Config')
const ClientOrder = require('../models/ClientOrder')
const ServerService = require('../models/ServerService')
const request = require('request');

const profileController = {
    renderLikeSale: (req, res, next) => {
        const userData = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
        const token = req.cookies.token;
        User.findOne({_id: userData.id})
            .then((user) => {
                const numberFormatter = Intl.NumberFormat();
                const totalMoney = numberFormatter.format(user.totalMoney);
                const totalBank = numberFormatter.format(user.totalBank);
                const totalUsed = numberFormatter.format(user.totalUsed);
                
                Config.findOne({})
                    .then((data) => {
                        ServerService.find({codeservice: "like_post_sale"})
                            .then(service => {
                                ClientOrder.find({name: user.username, react: "like"})
                                    .then(order => {
                                        setTimeout(() => {
                                            res.render('facebook/likeSale', {user, order: order.reverse(), err: req.flash('error'), success: req.flash('success'), service, data, totalMoney, totalBank, totalUsed, token, validAdmin: checkAdmin(user.admin)})
                                        }, 150)
                                    })
                                    .catch(err => {
                                        console.log(`Lỗi database`)
                                    });
                            })
                            .catch(err => {
                                console.log(`Lỗi database`)
                            })
                    })
                    .catch(err => {
                        console.log(`Lỗi database`)
                    })
            })
            .catch((err) => {
                res.clearCookie('token')
                res.redirect('/auth/login')
            })
    },
    renderSubVip: (req, res, next) => {
        const userData = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
        const token = req.cookies.token;
        User.findOne({_id: userData.id})
            .then((user) => {
                const numberFormatter = Intl.NumberFormat();
                const totalMoney = numberFormatter.format(user.totalMoney);
                const totalBank = numberFormatter.format(user.totalBank);
                Config.findOne({})
                    .then((data) => {
                        ServerService.find({codeservice: "sub_vip"})
                            .then(service => {
                                ClientOrder.find({name: user.username, react: "follow"})
                                    .then(order => {
                                        setTimeout(() => {
                                            res.render('facebook/subVip', {user, order: order.reverse(), err: req.flash('error'), success: req.flash('success'), service, data, totalMoney, totalBank, token, validAdmin: checkAdmin(user.admin)})
                                        }, 150)
                                    })
                                    .catch(err => {
                                        console.log(`Lỗi database`)
                                    })
                            })
                            .catch(err => {
                                console.log(`Lỗi database`)
                            })
                    })
                    .catch(err => {
                        console.log(`Lỗi database`)
                    })

            })
            .catch((err) => {
                res.clearCookie('token')
                res.redirect('/auth/login')
            })
    },
}

module.exports = profileController;
