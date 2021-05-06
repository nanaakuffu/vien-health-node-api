const jwt = require("jsonwebtoken");
const config = require("../config/sys_config");
const db = require("../db/db");
const User = db.user;
const Token = db.token;

// Build the auth middleware
const auth = () => {
    return async (request, response, next) => {
        try {
            const authHeader = request.headers.authorization;
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                return response.status(401).send({ message: 'Access denied. No credentials sent!' });
            }

            const token = authHeader.replace(bearer, '');

            // Verify Token
            const decoded = jwt.verify(token, config.jwt_secret);
            const user = await User.findById(decoded.id);
            const token_exists = await Token.findOne({ user_id: decoded.id });

            if (!token_exists) {
                return response.status(401).send({ message: 'Authentication failed!' });
            }

            // if the user has permissions
            request.currentUser = user;
            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    };
};

module.exports = auth;
