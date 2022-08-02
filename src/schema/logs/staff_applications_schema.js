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
    },
    timestamp: {
        type: Date,
        require: true
    },
    duration: {
        type: String,
        required: true
    },
    q1: {
        type: String,
        require: true
    },
    q2: {
        type: String,
        require: true
    },
    q3: {
        type: String,
        require: true
    },
    q4: {
        type: String,
        require: true
    },
    q5: {
        type: String,
        require: true
    },
    q6: {
        type: String,
        require: true
    },
    q7: {
        type: String,
        require: true
    },
    q8: {
        type: String,
        require: true
    },
    q9: {
        type: String,
        require: true
    },
    q10: {
        type: String,
        require: true
    },
    q11: {
        type: String,
        require: true
    },
    q12: {
        type: String,
        require: true
    },
    q13: {
        type: String,
        require: true
    }

});

module.exports = mongoose.model('staff applications', staffApplicationSchema)