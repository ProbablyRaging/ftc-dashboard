const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true });