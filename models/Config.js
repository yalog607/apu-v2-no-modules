const mongoose = require('mongoose')
const AutoIncrementFactory = require('mongoose-sequence');

const connection = mongoose.createConnection(`${process.env.MONGODB_URL}`);

const AutoIncrement = AutoIncrementFactory(connection);

const Config = new mongoose.Schema({
    dem: {
        type: Number,
    },
    apitokenadmin: {
        type: String,
    },
    namesite: {
        type: String,
    },
    facebook: {
        type: String,
    },
    zalo: {
        type: String,
    },
    cuphap: {
        type: String,
    },
    ratectv: {
        type: Number,
    },
    ratedaily: {
        type: Number,
    },
    ratenhaphanphoi: {
        type: Number,
    },
    favicon: {
        type: String,
    },
    logouser: {
        type: String,
    },
    ckctv: {
        type: Number,
    },
    ckdaily: {
        type: Number,
    },
    cknhaphanphoi: {
        type: Number,
    },
}, {
    dem: false,
    timestamps: true
})
Config.plugin(AutoIncrement, {inc_field: 'dem'});

module.exports = mongoose.model('Config', Config)