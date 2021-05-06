const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./../models/user");
db.token = require("./../models/token")

module.exports = db;
