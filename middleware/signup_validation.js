const db = require("./../db/db");
const User = db.user;

// Initialise the middleware
const signup_middleware = {};

signup_middleware.checkUniqueEmail = (request, response, next) => {
    // Email
    User.findOne({
        email: request.body.email
    }).exec((err, user) => {
        if (err) {
            response.status(500).send({ message: err });
            return;
        }

        if (user) {
            response.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }

        next();
    });
};

module.exports = signup_middleware;
