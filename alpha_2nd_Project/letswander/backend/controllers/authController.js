const mongoose = require("mongoose");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../utils/email")
let express = require('express'); 
let app = express() 
const admin = require("../config/firebase-config");
// let cookieParser = require('cookie-parser'); 
// let cookie = require("js-cookie")


// app.use(cookieParser()); 


exports.signup = async (req, res, next) => {
try{
    const newUser = await User.create(req.body);


    const token = jwt.sign({id: newUser._id}, "my-very-naughty-monkey-just-swallowed-pumkin-nuts")
    req.name = newUser.name;

     res.status(201).json({
        status: "success",
        token
     })

} catch(err){
    res.status(500).json({
        status: "fail",
        // message: "Error while creating an user"
        message: err
    })
}
}



exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const us = await User.findOne({email: email})

      let name;
      if(us){
        name = us.name;
      }
      else
      name = "duck"

      // res.status(404).json({
      //   status: "fail",
      //   message: "User not found"
      // })



      // console.log(name);
  
      if (!email || !password) {
        // throw new Error("Please provide credentials")
        return req.status(400).json({
          status: 'fail',
          message: 'Please provide credentials',
        });
        // return next()
      }
  
      // const user = await User.findOne({ email }).select('+password');
      const user = await User.findOne({ email });
  
      if (!user || !(await user.correctPassword(password, user.password))) {
        return req.status(400).json({
          status: 'fail',
          message: 'Incorrect email or password',
        });
        // return next();
      }
  
      const token = jwt.sign({ id: user._id },  "my-very-naughty-monkey-just-swallowed-pumkin-nuts");
  
      res.status(200).json({
        status: 'success',
        token,
        name
      });
    } catch (err) {
      return res.status(400).json({
        status: 'fail',
        message: "Invalid or unentered credentials",
      });
    }
  };
  
//   const GlUser = require("./../Models/userGglModel");

// exports.googleUserMongoId = async (newUserId) => {
//     const user = await User.findById(newUserId);
//     user
// }

  exports.signupGoogle = async (req, res, next) => {
      try{
        const newUser = new User(req.body);
        const user = await User.findOne({email: newUser.email})

        if(!user){
        req.user = newUser.email;
        await newUser.save({ validateBeforeSave: false });
      
           res.status(201).json({
              status: "success",
              // token
              message: "Signed up with google"
           })
          }
          else{
            res.status(500).json({
              status: "fail",
              // token
              message: "Account already present, try logging in"
           })
          }
      
      } catch(err){
          res.status(500).json({
              status: "fail",
              // message: "Error while creating an user"
              message: err
          })
      }
      }
  
  
      exports.loginGoogle = async (req, res, next) => {
          try{
              const newUser = await User.findOne({email: req.body.email});
        

              // console.log(newUser)
               newUser ? res.status(201).json({
                  status: "success",
                  // token
                  newUser
               }) : res.status(404).json({
                status:"fail",
                message: "User not found, try signing up"
               })
          
          } catch(err){
              res.status(500).json({
                  status: "fail",
                  // message: "Error while creating an user"
                  message: err
              })
          }
          }



  
  exports.protect = async (req, res, next) => {
      try {
          // 1. Check for token in header
          let token;
          if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
              token = req.headers.authorization.split(" ")[1];
          }
  
          // console.log(token)
          if (!token) {
              return res.status(400).json({
                  status: "fail",
                  message: "Invalid or missing token"
              });
          }
  
          // 2. Verify Firebase token
          let decodedValue;
          try {
              decodedValue = await admin.auth().verifyIdToken(token.trim());
              // console.log(decodedValue)

              if(decodedValue){
              const user = await User.findOne({email: decodedValue.email})
              // console.log(user)
              if(user)
                req.user = user._id
            }

            } catch (error) {
                // Handle Firebase token verification errors
                console.log(error.message +"    authController")
            }
            // console.log(decodedValue)
  
          // If token is not a Firebase token, verify it using jwt
          let decoded;
          if (!decodedValue) {
              try {
                  decoded = await promisify(jwt.verify)(token, "my-very-naughty-monkey-just-swallowed-pumkin-nuts");
                  if(decoded){
                    req.user = decoded.id;
                  }
              } catch (error) {
                  return res.status(400).json({
                      status: "fail",
                      message: "Invalid token"
                  });
              }
          }
  
          // 3. Check if the user still exists (Firebase token would have user_id, while other JWT might have id)
          // req.user = decodedValue ? decodedValue.email : decoded.id;
        //   req.user = decoded && decoded.id;

          console.log(req.user)
  
          if (!req.user) {
              return res.status(400).json({
                  status: "fail",
                  message: "Account doesn't exist"
              });
          }
  
          next();
      } catch (err) {
          return res.status(500).json({
              status: "fail",
              message: err.message
          });
      }
  };
  


// exports.bookedTours = async (req, res, next) => {
//   try{
//   const user = await User.findByIdAndUpdate(req.user._id.toString(), req.body, {new: false});

//   res.status(200).json({
//     status: "success",
//     body: req.body
//   })
// } catch(err){
//   res.status(400).json({
//     status: "fail",
//     message: err
//   })
// }
// }






exports.restrictTo = function (...roles){
    return (req, res, next) => {
        console.log(req.user.role)
        if(!roles.includes(req.user.role)){
            return res.status(404).json({
                status: "fail",
                message: "You are not permitted"
            })
        }
        next();
    }
}