const mongoose = require('mongoose');

const rankSchema = mongoose.Schema({

    rank: {
        type: Number,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    discrim: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    msgCount: {
        type: String,
        required: true
    },
    xp: {
        type: Number,
        required: true
    },
    xxp: {
        type: Number,
        required: true
    },
    xxxp: {
        type: Number,
        required: true
    },

});

module.exports = mongoose.model('ranks', rankSchema)