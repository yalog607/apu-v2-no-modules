const mongoose = require('mongoose')
const AutoIncrementFactory = require('mongoose-sequence');

const connection = mongoose.createConnection(`${process.env.MONGODB_URL}`);

const AutoIncrement = AutoIncrementFactory(connection);

const historyBank = new mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    time: {
        type: String,
    },
    type: {
        type: String,
    },
    bankcode: {
        type: String,
    },
    namebank: {
        type: String,
    },
    realtake: {
        type: String,
    },
    content: {
        type: String,
    },
    
}, {
    timestamps: true
})
historyBank.plugin(AutoIncrement, {inc_field: 'id'});

module.exports = mongoose.model('historyBank', historyBank)