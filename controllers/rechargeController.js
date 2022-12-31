const User = require('../models/User')
const Bank = require('../models/Bank')
const Config = require('../models/Config')
const HistoryBank = require("../models/HistoryBank");
const jwt = require('jsonwebtoken')
const {checkAdmin} = require('../middleware/middlewareCheckAdmin')
const request = require('request')

const profileController = {
    renderBanking: (req, res, next) => {
        const userData = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
        const token = req.cookies.token;
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
                Bank.find({})
                    .then((data) => {
                        HistoryBank.find({name: user.username})
                            .then(history => {
                                Config.findOne({})
                                    .then(config => {
                                        setTimeout(() => {
                                            const numberFormatter = Intl.NumberFormat('en-US');
                                            const min = numberFormatter.format(data.naptoithieu);
                                            var momo = data.filter((datas) => {
                                                return datas.type === "Momo";
                                            })
                                            var lsmomo = history.filter((historys) => {
                                                return historys.type === "Momo";
                                            })
                                            var mb = data.filter((datas) => {
                                                return datas.type === "MB Bank";
                                            })
                                            var lsmb = history.filter((historys) => {
                                                return historys.type === "MB Bank";
                                            })
                                            res.render('recharge/banking', {user, min, config, history, lsmomo: lsmomo.reverse(), momo, lsmb: lsmb.reverse(), mb, data, validAdmin: checkAdmin(user.admin)})
                                        }, 150)
                                    })
                                    .catch(err => {
                                        res.send('Lỗi database')
                                    })
                            })
                            .catch(err => {
                                res.redirect('/')
                            })
                    })
                    .catch(err => {
                        res.redirect('/')
                    })

            })
            .catch((err) => {
                res.clearCookie('token')
                res.redirect('/auth/login')
            })
    },
    getBank: async(req, res, next) => {
        try {
            var options = {
                method: 'POST',
                url: 'https://api-momo.com/api/getTransHistory',
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json",
                    "cache-control": "no-cache",
                },
                body: JSON.stringify({
                    access_token: process.env.TOKENBANKAUTO,
                    phone: process.env.PHONEBANKAUTO,
                    limit: 100,
                    offset: 0
                })
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                resp = JSON.parse(response.body);
                var i = 1;
                for (let item of resp.data) {
                    var nd = item.comment;
                    var sotien = item.amount;
                    var nguoibank = item.partnerName;
                    var stt = item.status;
                    var magd = item.tranId;
                    var sdtbank = item.partnerId;
                    var tg = item.ackTime;
                    User.findOne({content: nd})
                        .then(user => {
                            HistoryBank.find({bankcode: magd})
                                .then(async(bank) => {
                                    if (bank == "") {
                                        const numberFormatter = Intl.NumberFormat('en-US');
                                        const tienbank = numberFormatter.format(sotien);
                                        const newHistoryBank = await new HistoryBank({
                                            name: user.username,
                                            time: tg,
                                            type: "Momo",
                                            bankcode: magd,
                                            namebank: nguoibank,
                                            realtake: tienbank,
                                            content: nd,
                                        });
    
                                        const history = await newHistoryBank.save();
                                        User.updateOne({content: nd}, {
                                            totalMoney: Number(sotien) + Number(user.totalMoney),
                                            totalBank: Number(sotien) + Number(user.totalBank),
                                        })
                                            .then(done => {});
                                        return res.send(`Đã cộng cho ${i++} đơn \n`)
                                    }else {
                                        res.send('')
                                    }
                                })
                                .catch(async(err) => {})
                        })
                }
            });
        } catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = profileController;
