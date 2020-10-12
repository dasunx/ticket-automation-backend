const { check } = require('express-validator');

const userSignUpValidator = [
  check('name').not().isEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Must be a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];
exports.userSignUpValidator = userSignUpValidator;

const userLoginValidator = [
  check('email').isEmail().withMessage('Must be a valid email'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];
exports.userLoginValidator = userLoginValidator;
