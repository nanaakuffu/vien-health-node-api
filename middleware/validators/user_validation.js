const { body, check, validationResult } = require('express-validator');

exports.validateUserSchema = [
    check('first_name')
        .exists()
        .withMessage('Your first name is required')
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('last_name')
        .exists()
        .withMessage('Your last name is required')
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    check('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    check('contact_number')
        .exists()
        .withMessage('Contact number is required')
        .isNumeric()
        .withMessage('Must be only numeric characters')
        .isLength({ min: 10 })
        .withMessage('Must be at least 10 characters long'),
    check('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('Password must contain at least 6 characters'),
    check('confirm_password')
        .exists()
        .withMessage('Confirm password is required.')
        .notEmpty()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];


exports.validateLogin = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];