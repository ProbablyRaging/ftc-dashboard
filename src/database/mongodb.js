const mongoose = require('mongoose');

const dbOne = mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true });
const dbTwo = mongoose.createConnection(process.env.DB_PATH2, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = { dbOne, dbTwo }