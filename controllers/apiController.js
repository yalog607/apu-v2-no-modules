const User = require('../models/User')
const Config = require('../models/Config')
const ClientOrder = require('../models/ClientOrder')
const ServerService = require('../models/ServerService')
const jwt = require('jsonwebtoken')
const {checkAdmin} = require('../middleware/middlewareCheckAdmin')
const request = require('request');

const profileController = {
    // POST
    likePostSaleOrder: async(req, res, next) => {
        try {
            const userData = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
            User.findOne({_id: userData.id})
                .then(user => {
                    const linkPost = req.body.link_post;
                    const serverOrder = req.body.server_order;
                    const reaction = req.body.reaction;
                    const amount = req.body.amount;
                    const note = req.body.note;                    
                    if (!linkPost) {
                        req.flash("error", "Trường URL bài viết không được bỏ trống!")
                        return res.redirect('/facebook/like-sale')
                    }
                    if (!serverOrder) {
                        req.flash("error", "Trường máy chủ không được bỏ trống!")
                        return res.redirect('/facebook/like-sale')
                    }
                    if (!amount) {
                        req.flash("error", "Trường số lượng không được bỏ trống!")
                        return res.redirect('/facebook/like-sale')
                    }
                    if (amount < 100) {
                        req.flash("error", "Trường số lượng phải tối thiểu là 100!")
                        return res.redirect('/facebook/like-sale')
                    }
                    const server = serverOrder.slice(2);
                    ServerService.findOne({codeservice: "like_post_sale", serverservice: server})
                        .then(service => {
                            const total = service.rateservice * amount;
                            if(service.statusservice == 0) {
                                req.flash("error", "Máy chủ bảo trì, vui lòng chọn gói dịch vụ khác!")
                                return res.redirect('/facebook/like-sale')
                            }
                            if (user.totalMoney < total) {
                                req.flash("error", "Số dư của bạn không đủ để thanh toán, vui lòng nạp thêm!")
                                return res.redirect('/facebook/like-sale')
                            }
                            Config.findOne({})
                                .then(config => {
                                    if (!config.apitokenadmin) {
                                        req.flash("error", "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên!")
                                        return res.redirect('/facebook/like-sale')
                                    }
                                    const options = {
                                        method: 'POST',
                                        url: 'https://thuycute.hoangvanlinh.vn/api/service/facebook/like-post-sale/order',
                                        headers: {
                                            "Content-Type": "application/json",
                                            "api-token": config.apitokenadmin,
                                        },
                                        body: JSON.stringify({
                                            link_post: linkPost,
                                            server_order: serverOrder,
                                            reaction: reaction,
                                            amount: amount,
                                            note: note
                                        })
                                    };
                                    request(options, async function (error, response, body) {
                                        if (error) throw new Error(error);
                                        const Body = JSON.parse(body)
                                        if (Body.status === true) {
                                            const Response = Body.data;
                                            User.updateOne({_id: userData.id}, {
                                                totalMoney: Number(user.totalMoney) - Number(total),
                                                totalUsed: Number(user.totalUsed) + Number(total)
                                            })
                                            .then(done => {});
                                            const d = new Date();
                                            var year = d.getFullYear();
                                            var month = d.getMonth() + 1;
                                            var day = d.getDate();
                                            var hour = d.getHours();
                                            var minute = d.getMinutes();
                                            var second = d.getSeconds();
                                            var time = `${year}-${month}-${day} ${hour}:${minute}:${second}`
                                            // Add client order to Database
                                            const newClientOrder = await new ClientOrder({
                                                name: user.username,
                                                time: time,
                                                codeOrder: Response.code_order,
                                                idPost: Response.link_post,
                                                server: `Server ${Response.server_order}`,
                                                start: Response.start,
                                                react: Response.reaction,
                                                amount: Response.amount,
                                                note: Response.note,
                                                total: total,
                                                status: "Đã thanh toán"
                                            })
                                            const saveClientOrder = await newClientOrder.save();
                                            //
                                            req.flash("success", "Thanh toán đơn hàng thành công!")
                                            return res.status(200).redirect('/facebook/like-sale');
                                        }else {
                                            req.flash("error", "Có lỗi xảy ra trong quá trình lên đơn. Vui lòng liên hệ quản trị viên!")
                                            return res.redirect('/facebook/like-sale')
                                        }
                                    });
                                })
                        })
                        .catch(err => {
                            res.redirect('/');
                        })
                })
                .catch(err => {
                    res.redirect('/');
                })
        } catch(err) {
            res.status(500).json(err)
        }
    },
    subVipOrder: async(req, res, next) => {
        try {
            const userData = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
            User.findOne({_id: userData.id})
                .then(user => {
                    const idfb = req.body.idfb;
                    const serverOrder = req.body.server_order;
                    const amount = req.body.amount;
                    const note = req.body.note;
                    if (!idfb) {
                        req.flash("error", "Trường ID facebook không được bỏ trống!")
                        return res.redirect('/facebook/sub-vip')
                    }
                    if (!serverOrder) {
                        req.flash("error", "Trường máy chủ không được bỏ trống!")
                        return res.redirect('/facebook/sub-vip')
                    }
                    if (!amount) {
                        req.flash("error", "Trường số lượng không được bỏ trống!")
                        return res.redirect('/facebook/sub-vip')
                    }
                    if (amount < 500) {
                        req.flash("error", "Trường số lượng phải tối thiểu là 500!")
                        return res.redirect('/facebook/sub-vip')
                    }
                    const server = serverOrder.slice(2)
                    ServerService.findOne({codeservice: "sub_vip", serverservice: server})
                        .then(service => {
                            const total = service.rateservice * amount;
                            if(service.statusservice == 0) {
                                req.flash("error", "Máy chủ tạm bảo trì, vui lòng chọn máy chủ khác!")
                                return res.redirect('/facebook/sub-vip')
                            }
                            if (user.totalMoney < total) {
                                req.flash("error", "Số coin của bạn không đủ để thanh toán, vui lòng nạp thêm!")
                                return res.redirect('/facebook/sub-vip')
                            }
                            Config.findOne({})
                                .then(config => {
                                    if (!config.apitokenadmin) {
                                        req.flash("error", "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên!")
                                        return res.redirect('/facebook/sub-vip')
                                    }
                                    const options = {
                                        method: 'POST',
                                        url: 'https://thuycute.hoangvanlinh.vn/api/service/facebook/sub-vip/order',
                                        headers: {
                                            "Content-Type": "application/json",
                                            "api-token": config.apitokenadmin,
                                        },
                                        body: JSON.stringify({
                                            idfb: idfb,
                                            server_order: serverOrder,
                                            amount: amount,
                                            note: note,
                                        })
                                    };
                                    request(options, async function (error, response, body) {
                                        if (error) throw new Error(error);
                                        const Body = JSON.parse(body)
                                        if (Body.status === true) {
                                            const Response = Body.data;
                                            console.log(Response);
                                            User.updateOne({_id: userData.id}, {
                                                totalMoney: Number(user.totalMoney) - Number(total),
                                                totalUsed: Number(user.totalUsed) + Number(total)
                                            })
                                            .then(done => {});
                                            const d = new Date();
                                            var year = d.getFullYear();
                                            var month = d.getMonth() + 1;
                                            var day = d.getDate();
                                            var hour = d.getHours();
                                            var minute = d.getMinutes();
                                            var second = d.getSeconds();
                                            var time = `${year}-${month}-${day} ${hour}:${minute}:${second}`
                                            // Add client order to Database
                                            const newClientOrder = await new ClientOrder({
                                                name: user.username,
                                                time: time,
                                                codeOrder: Response.code_order,
                                                idPost: Response.idfb,
                                                server: `Server ${Response.server_order}`,
                                                start: Response.start,
                                                react: "follow",
                                                amount: Response.amount,
                                                note: Response.note,
                                                total: total,
                                                status: "Đã thanh toán"
                                            })                                            
                                            const saveClientOrder = await newClientOrder.save();
                                            //
                                            req.flash("success", "Thanh toán đơn hàng thành công!")
                                            return res.status(200).redirect('/facebook/sub-vip');
                                        }else {
                                            req.flash("error", "Có lỗi xảy ra trong quá trình lên đơn. Vui lòng liên hệ quản trị viên!")
                                            return res.redirect('/facebook/sub-vip')
                                        }
                                    });
                                })
                        })
                        .catch(err => {
                            res.redirect('/')
                        })
                })
                .catch(err => {
                    res.redirect('/')
                })
        } catch(err) {
            res.status(500).json(err)
        }
    },
}

module.exports = profileController;
