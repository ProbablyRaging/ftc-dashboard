const mongoose = require('mongoose');

const staffApplicationSchema = mongoose.Schema({

    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    discriminator: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    age: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: false
    }

});

module.exports = mongoose.model('staff applications', staffApplicationSchema)