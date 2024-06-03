// Ynd9DAItyvIJvSvh
require("dotenv").config()

const tourRouter = require("./router/tourRouter")
const userRouter = require("./router/userRouter")
const detailRouter = require("./router/detailRouter")
const reviewRouter = require("./router/reviewRouter")
const bookedRouter = require("./router/bookedRouter")
const chatRouter = require("./router/chatRouter")
const messageRouter = require("./router/messageRouter")


const express= require("express");
const app = express()
const cors = require("cors")
// const Tour = require("./Models/tourModel")
// const { default: mongoose } = require("mongoose")


// app.use(cors())

const corsOptions = {
    origin: 'http://localhost:5000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};


app.use(cors(corsOptions));

// app.use(auth(config));


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/details", detailRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/booked", bookedRouter);
app.use("/api/v1/makePayment", bookedRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/message", messageRouter);

// console.log(process.env.type, "pro")

module.exports = app;