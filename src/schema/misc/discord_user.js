const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    guilds: {
        type: Array,
        required: true
    },
    roles: {
        type: Array,
        required: true
    },
    isStaff: {
        type: Boolean,
        required: true
    }
});

const DiscordUser = module.exports = mongoose.model('dashboardusers', userSchema);