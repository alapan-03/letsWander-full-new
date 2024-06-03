const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.stripe_secret)
const cors = require("cors")
const bodyParser = require("body-parser");
const User = require("../models/userModel");
const Tour = require("../models/tourModel");

app.use(cors());

let i = 0;

const lineItems = [
    {
      "price": "prctbl_1PFf3WSAGBUk6wlRmmpgHJgc",
      "quantity": 1,
      "description": "Product 1"
    },
  ]
  

  const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Learn React Today" }],
    [2, { priceInCents: 20000, name: "Learn CSS Today" }],
  ])

// app.post("/api/v1/makePayment", bodyParser.json() ,async (req, res) => {

exports.stripe = async (req, res, next) => {

  i = 0;
  console.log(req.body)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Premium plan",
            },
            unit_amount: "300",
          },
          quantity: "1",
        }
      ]
      // })
      ,
      success_url: "http://localhost:3000/",
      cancel_url: "http://localhost:3000/landing"
    })
    
    res.json({
      id:session.id
    })
  }
  // })
  
// app.listen(4000)


exports.verifyStripe2 = async(req, res, next) => {

  let {sessionId, tourId} = req.body;
  
  console.log("dkjgndfng")
  try{
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session && session.payment_status === "paid") {
      let user;
          // if(req.user.indexOf('@') > -1){
          // user = await User.findOneAndUpdate({email: req.user}, { $addToSet: { tour: tourId } },
          //   { new: true });
          // }
          // else{
            user = await User.findOneAndUpdate({_id: req.user}, { $addToSet: { tour: tourId } },
              { new: true });
          // }
          
          // if(i === 0){
          const tour = await Tour.findById(tourId);
          const admin = await User.findOneAndUpdate({ _id: tour.admin}, { $addToSet: { chatJoined: tourId } },
            { new: true });
          const guide1 = await User.findOneAndUpdate({ _id: tour.guides[0]}, { $addToSet: { chatJoined: tourId } },
            { new: true } )
          const guide2 = await User.findOneAndUpdate({ _id: tour.guides[1]}, { $addToSet: { chatJoined: tourId } },
            { new: true } )
          console.log(guide1)


          // admin.chatJoined.push(tourId);
          // guide1.chatJoined.push(tourId);
          // guide2.chatJoined.push(tourId);
          // await admin.save({validateBeforeSave: false})
          // await guide1.save({validateBeforeSave: false})
          // await guide2.save({validateBeforeSave: false})
          // }

          i = 1;

          return res.status(200).json({
            status: "Success",
            user,
            admin
          })
          
    }
    else{
      res.status(500).json({
        status: "fail",
        message: "Invalid session or transaction failed"
      })
    }

  }
  catch(err){
    res.status(500).json({
      status:"fail",
      message: err.message
    })
  }
}