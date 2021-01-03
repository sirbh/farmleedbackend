const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const User = require('../models/user')

exports.setDetails = (req,res,next) =>{
   console.log(req.body)
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
   }
   
   const id = req.userId
   const name = req.body.username;
   const email = req.body.email;
   const phone = req.body.phone;
   
   User.findById(id)
       .then(user=>{
          user.name = name,
          user.email = email,
          user.phone = phone
          return user.save()
       })
       .then(resp=>{
         res.status(200).json({username:resp.name,email:resp.email,phone:resp.phone})
       })
       .catch(err=>{
          next(err)
       })
   
}

exports.login = (req,res,next)=>{
   
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
   }
   const email = req.body.email;
   const password = req.body.password;
   let loadedUser;
   User.findOne({ email: email })
   .then((user) => {
     if (!user) {
       const error = new Error("User Not Found");
       error.statusCode = 401;
       error.data = [{
          value:email,
          msg:'User not found',
          param:'email',
          location:'body'
       }]
       throw error;
     }
     loadedUser = user;
     return bcrypt.compare(password, user.password);
   })
   .then((data) => {
      if (!data) {
         const error = new Error("wrong password");
       error.statusCode = 401;
       error.data = [{
          value:password,
          msg:'wrong password',
          param:'password',
          location:'body'
       }]
       throw error;
      }
      const token = jwt.sign(
         {
           userId: loadedUser._id.toString()
         },
         process.env.ACCESS_TOKEN_SECRET
       );
       
       res.status(200).json({ token: token, userId: loadedUser._id.toString(), cart:loadedUser.cart });

      }
   ).catch(err=>{
      if (!err.statusCode) {
         err.statusCode = 500;
       }
       next(err);
   })

}

exports.getDetails = (req,res,next)=>{
   User.findById(req.userId)
   .then(resp=>{
      console.log(resp)
      res.status(200).json({username:resp.name,email:resp.email,phone:resp.phone})
   })
   .catch(err=>{
      next(err)
   })
}

