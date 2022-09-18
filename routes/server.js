const indexRouter = require('./index');
const dashboardRouter = require('./dashboard');
const profileRouter = require('./profile');
const authRouter = require('./auth');
const rechargeRouter = require('./recharge');

function route(app) {
    app.use('/profile', profileRouter);
    app.use('/recharge', rechargeRouter);
    app.use('/home', dashboardRouter);
    app.use('/auth', authRouter);
    app.use('/', indexRouter);
}

module.exports = route;