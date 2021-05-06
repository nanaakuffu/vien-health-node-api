const express = require('express');
const { validateLogin, validateUserSchema } = require("../middleware/validators/user_validation");
const { checkUniqueEmail } = require('../middleware/signup_validation')
const { userLogin, registerUser } = require("../controllers/user_controller");
const auth = require('../middleware/auth')

const router = express.Router();

router.post('/login', validateLogin, userLogin);
router.post('/register', validateUserSchema, checkUniqueEmail, registerUser);
// router.post('/logout', auth(), userLogout);

module.exports = router;