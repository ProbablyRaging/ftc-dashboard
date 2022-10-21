const mongoose = require('mongoose');
const { dbTwo } = require('../../database/mongodb');

const dtp = mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    game: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const dtpSchema = dbTwo.model('dtp', dtp);

module.exports = dtpSchema;