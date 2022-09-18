const mongoose = require('mongoose')
const AutoIncrementFactory = require('mongoose-sequence');

const connection = mongoose.createConnection(`${process.env.MONGODB_URL}`);

const AutoIncrement = AutoIncrementFactory(connection);

const Service = new mongoose.Schema({
    list: {
        type: Number,
    },
    codeservice: {
        type: String,
    },
    serverservice: {
        type: String,
    },
    rateservice: {
        type: Number,
    },
    titleservice: {
        type: String,
    },
    servername: {
        type: String,
    },
    statusservice: {
        type: Number,
    }
}, {
    timestamps: true
})
Service.plugin(AutoIncrement, {inc_field: 'list'});

module.exports = mongoose.model('Service', Service)