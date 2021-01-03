const express = require("express");
const { body } = require("express-validator");

const authMiddleware = require('../middlewares/is-auth')
const User = require('../models/user')
const userController = require('../controllers/user')


const router = express.Router();

// const loginValidation = [
//   body("email")
//     .not()
//     .isEmpty()
//     .withMessage("e-mail is required")
//     .bail()
//     .isEmail()
//     .withMessage("not a valid e-mail"),
//   body("password")
//     .not()
//     .isEmpty()
//     .withMessage("you must provide a password")
//     .bail()
//     .isLength({min:8})
//     .withMessage("invalid password")
// ];

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
          if(userDoc._id.toString()!==req.userId.toString())
          {
            console.log('in here')
            return Promise.reject('E-Mail address already registred with other user');
          }
        }
      })
    })
    .normalizeEmail(),
    body('username')
    .not().isEmpty()
    .withMessage('username is required')
    .bail()
    .trim()
    .escape()
];

router.get("/getdetails",authMiddleware, userController.getDetails);
router.post('/setdetails',authMiddleware,signupValidation,userController.setDetails)
// router.post("/login", loginValidation, authController.login);
// router.post("/setcart", authMiddleware, authController.setCart);
 
module.exports = router;
