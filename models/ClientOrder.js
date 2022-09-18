const mongoose = require('mongoose')
const AutoIncrementFactory = require('mongoose-sequence');
const connection = mongoose.createConnection(`${process.env.MONGODB_URL}`);
const AutoIncrement = AutoIncrementFactory(connection);

const ClientOrder = new mongoose.Schema({
    orderId: {
        type: Number,
    },
    name: {
        type: String,
    },
    time: {
        type: String,
    },
    codeOrder: {
        type: String,
    },
    idPost: {
        type: String,
    },
    server: {
        type: String,
    },
    start: {
        type: String,
    },
    react: {
        type: String,
    },
    amount: {
        type: Number,
    },
    note: {
        type: String,
    },
    total: {
        type: Number,
    },
    status: {
        type: String,
    }
}, {
    timestamps: true
})
ClientOrder.plugin(AutoIncrement, {inc_field: 'orderId'});

module.exports = mongoose.model('ClientOrder', ClientOrder)