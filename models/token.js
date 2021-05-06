const mongoose = require("mongoose");

const Token = mongoose.model(
    "Token",
    new mongoose.Schema({
        user_id: String,
        email: String,
        user_agent: String,
    })
);

module.exports = Token;
