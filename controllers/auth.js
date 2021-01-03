const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const User = require('../models/user')

exports.signup = (req,res,next) =>{
   console.log(req.body)
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
   }
   
   const name = req.body.username;
   const email = req.body.email;
   const password = req.body.password;
   const conPassword = req.body.confirmPassword;
   const phone = req.body.phone;
   const cart = {
      cartItems:[],
      totalItems:0
   }


   bcrypt
   .hash(password, 12)
   .then(hashedPw => {
      const user = new User({
         name,
         email,
         password:hashedPw,
         phone,
         cart
      });
     return user.save();
   })
   .then(resp=>{
      const token = jwt.sign(
         {
           userId: resp._id.toString()
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn:'1h'
         }
       );
       
       res.status(200).json({ token: token, cart:resp.cart,expirationTime:3600,userId:resp._id });
   })
   .catch(err=>{
      console.log(err)
      res.status(500).json({message:'server error'})
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
       error.statusCode = 422;
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
       error.statusCode = 422;
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
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn:'1h'
         }
       );
       
       res.status(200).json({ token: token, cart:loadedUser.cart,expirationTime:3600,userId:loadedUser._id });

      }
   ).catch(err=>{
      console.log(err)
      if (!err.statusCode) {
         err.statusCode = 500;
       }
       next(err);
   })

}

exports.setCart = (req,res,next)=>{

   const cart = req.body.cart;
   const id = req.userId;
  

   User.findById(id)
       .then(data=>{
          data.cart = cart;
          return data.save();
       })
       .then(data=>{
          console.log(data)
          res.status(200).json({message:'done'})
         // throw new Error()
       })
       .catch(err=>{
          next(err)
       })

}