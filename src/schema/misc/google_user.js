const mongoose = require('mongoose');
const { dbTwo } = require('../../database/mongodb');

const googleSchema = mongoose.Schema({
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
    }, 
    expires: {
        type: String,
        required: true
    }
});

const googleuser = dbTwo.model('googleuser', googleSchema);

module.exports = googleuser;