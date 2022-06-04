const mongoose = require('mongoose');

const testVideoList = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    videoIds: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('testVideoList', testVideoList);