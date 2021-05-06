const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        first_name: String,
        last_name: String,
        email: String,
        contact_number: String,
        password: String,
    })
);

module.exports = User;
