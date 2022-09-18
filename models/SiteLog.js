const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const siteLog = new mongoose.Schema({
    _id: {
        type: Number,
    },
    name: {
        type: String,
    },
    content: {
        type: String
    },
    time: {
        type: String
    },
    ip: {
        type: String
    }
}, {
    _id: false,
    timestamps: true
})
siteLog.plugin(AutoIncrement);

module.exports = mongoose.model('siteLog', siteLog)