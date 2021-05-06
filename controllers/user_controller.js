const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require('../config/sys_config');
const db = require("../db/db");

const User = db.user;
const Token = db.token;

registerUser = (request, response) => {
    const user = new User({
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        email: request.body.email,
        contact_number: request.body.contact_number,
        password: bcrypt.hashSync(request.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            response.status(500).send({ message: err });
            return;
        }

        response.status(201).send({ message: "User was registered successfully!" });
    });
};

userLogin = async (request, response) => {
    const user = await User.findOne({
        email: request.body.email
    })

    if (!user) {
        return response.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = await bcrypt.compare(
        request.body.password,
        user.password
    );

    if (!passwordIsValid) {
        return response.status(401).send({
            api_token: null,
            message: "Password provided is invalid!"
        });
    }

    const token = jwt.sign({ id: user._id }, config.jwt_secret, {
        expiresIn: 86400 // 24 hours
    });

    const token_data = await new Token({
        user_id: user._id,
        email: user.email,
        user_agent: request.headers['user-agent']
    })

    token_data.save((err, data) => {
        if (err) {
            response.status(500).send({ message: err });
            return;
        }

        response.status(200).send({
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            contact_number: user.contact_number,
            api_token: token
        });
    });
};

userLogout = async (request, response) => {

    const user = request.currentUser;

    const token = await Token.deleteOne({ user_id: user._id });

    if (token) {
        response.status(200).send({
            message: "User logged out successfully.",
            active: 0,
        });
    }


};

module.exports = {
    registerUser,
    userLogin,
    userLogout
}