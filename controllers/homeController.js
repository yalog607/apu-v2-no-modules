const User = require('../models/User')
const posts = require('../models/Posts')
const jwt = require('jsonwebtoken')
const {checkAdmin} = require('../middleware/middlewareCheckAdmin')

const dashboardController = {
    renderDashboard: (req, res, next) => {
        const userData = jwt.verify(req.cookies.token, process.env.JWT_ACCESS_KEY);
        User.findOne({_id: userData.id})
            .then((user) => {
                const numberFormatter = Intl.NumberFormat('en-US');
                const totalMoney = numberFormatter.format(user.totalMoney);
                const totalBank = numberFormatter.format(user.totalBank);
                const totalUsed = numberFormatter.format(user.totalUsed);
                var rank;
                if (user.rank === 4) {
                    rank = "Quản trị viên"
                }else if (user.rank === 1) {
                    rank = "Cộng tác viên"
                }else if (user.rank === 2) {
                    rank = "Đại lý"
                }else if (user.rank === 3) {
                    rank = "Nhà phân phối"
                }else {
                   rank = "Thành viên"
                }
                const img = '/assets/images/avt_fb.png';
                const currency = 'VNĐ';
                posts.find({})
                    .then((post) => {
                        setTimeout(() => {
                            res.render('home/dashboard', {user, img, currency, success: req.flash('success'), post: post.reverse(), totalMoney, totalBank, totalUsed, validAdmin: checkAdmin(user.admin)})
                        }, 150)
                    })
                    .catch(err => {
                        res.redirect('/')
                    })
            })
    }
}

module.exports = dashboardController;
