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
    guilds: {
        type: Array,
        required: true
    }
});

const DiscordUser = module.exports = mongoose.model('Dashboard Users', userSchema);