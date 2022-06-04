const mongoose = require('mongoose');

const googleSchema = new mongoose.Schema({
    discordId: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('googleuser', googleSchema);