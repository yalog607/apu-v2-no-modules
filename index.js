const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const request = require('request');
const cron = require('node-cron');
dotenv.config()

app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 7200000 }
}))
app.use(flash());

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('Connect to DB Successfully')
})

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route
const route = require('./routes/server');
route(app);

// Cron
const domain = `https://${process.env.DOMAIN}/recharge/api/momo`
cron.schedule('* * * * *', () => {
    request(domain, (err, response, body) => {
        if (!err) {
            console.log("Cron thành công");
            console.log(response.body);
            console.log("---------------");
        }
    })
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});