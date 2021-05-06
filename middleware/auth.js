const jwt = require("jsonwebtoken");
const config = require("../config/sys_config");
const db = require("../db/db");
const User = db.user;

// Initialise the auth middleware
const auth = () => {
    return async (request, response, next) => {
        let token = request.headers["x-access-token"];

        if (!token) {
            return response.status(403).send({ message: "No token provided!" });
        }

        const decoded = jwt.verify(token, config.jwt_secret);

        const user = await User.findById(decoded.id);

        request.current_user = user;
        next();
    };
};

module.exports = auth;
