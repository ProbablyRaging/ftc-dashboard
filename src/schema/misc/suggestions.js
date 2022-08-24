const mongoose = require('mongoose');
const { dbTwo } = require('../../database/mongodb');

const suggestionSchema = mongoose.Schema({
    suggestions: {
        type: Array,
        required: false
    }
});

const suggestion = dbTwo.model('suggestion', suggestionSchema);

module.exports = suggestion;