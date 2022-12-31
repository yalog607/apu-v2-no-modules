const indexRouter = require('./index');
const dashboardRouter = require('./dashboard');
const profileRouter = require('./profile');
const authRouter = require('./auth');
const rechargeRouter = require('./recharge');
const facebookRouter = require('./facebook');
const apiRouter = require('./api');

function route(app) {
    app.use('/profile', profileRouter);
    app.use('/recharge', rechargeRouter);
    app.use('/facebook', facebookRouter);
    app.use('/api', apiRouter);
    app.use('/home', dashboardRouter);
    app.use('/auth', authRouter);
    app.use('/', indexRouter);
}

module.exports = route;