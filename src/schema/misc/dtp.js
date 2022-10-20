const mongoose = require('mongoose');

const dtpSchema = mongoose.Schema({
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

module.exports = mongoose.model('dtp', dtpSchema);