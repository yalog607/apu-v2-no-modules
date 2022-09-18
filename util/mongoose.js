module.exports = {
    mutipleMongooseToObject: function (moongooses) {
        return moongooses.map(moongoose => moongoose.toObject());
    },
    mongooseToObject: function (moongoose) {
        return moongoose ? moongoose.toObject() : moongoose;
    }
};