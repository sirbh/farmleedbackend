const express = require("express");
const { body } = require("express-validator");
const User = require('../models/user')
const authController = require("../controllers/auth");
const authMiddleware = require("../middlewares/is-auth");

const router = express.Router();

const loginValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("e-mail is required")
    .bail()
    .isEmail()
    .withMessage("not a valid e-mail"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("you must provide a password")
    .bail()
    .isLength({min:8})
    .withMessage("invalid password")
];

const signupValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("not a valid email")
    .bail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          console.log('in here')
          return Promise.reject('E-Mail address already exists!');
        }
      })
    })
    .normalizeEmail(),
    body('username')
    .not().isEmpty()
    .withMessage('username is required')
    .bail()
    .trim()
    .escape(),
    body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('must have 8 digits'),
    body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('password confirmation does not match password');
      }
      
      // Indicates the success of this synchronous custom validator
      return true;
    })
];

router.post("/signup",signupValidation, authController.signup);
router.post("/login", loginValidation, authController.login);
router.post("/setcart", authMiddleware, authController.setCart);

module.exports = router;
