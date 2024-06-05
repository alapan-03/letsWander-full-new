const mongoose = require("mongoose");
const app = require("./app.js")
const cors = require('cors');
// const Tour = require("./Models/tourModel");
// const socketioo = require("socket.io")
const { Server } = require("socket.io");
require("dotenv").config()
const express = require("express");
const path = require("path");
// 

app.use(cors({
    origin: 'https://letswander-full-new.onrender.com', // Replace with your React app's URL
    credentials: true,
}));

console.log(process.env.mongo_connect)


mongoose.connect(process.env.mongo_connect)
.then(() =>
     console.log("DB connection successful")
    )

    const __dirname1 = path.resolve();


    if (process.env.NODE_ENV === "production") {
        app.use(express.static(path.join(__dirname1, "/frontend/build")));
      
        app.get("*", (req, res) =>
          res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
        );
      } else {
        app.get("/", (req, res) => {
          res.send("API is running..");
        });
      }


 const expressServer = app.listen(process.env.PORT ||
    // process.env.PORT || 
    5000, () => {

            // , ()=>{
                console.log("App is running...")
            // })
        })



const io = new Server(expressServer, {
    cors: {
        origin: "https://letswander-full-new.onrender.com", // Your frontend URL
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    // console.log(socket.id + " has connected!");

    socket.emit("hello", { data: "hello" });

    socket.on("setup", (data) => {
        // if (data.guides && data.guides.length) {
        //     data.guides.forEach(guide => {
        //         socket.join(guide);
        //         console.log(`User joined guide: ${guide}`);
        // console.log(data._id, "sdkokdc")

        if(data){
        socket.join(data._id)
        // console.log("user got setup", data._id)
        }
});


    socket.on("joinChat", (chatId) => {
        socket.join(chatId);
        // console.log(`User joined chat: ${chatId}`);
    });

    socket.on("leaveChat", (chatId) => {
        socket.leave(chatId);
        // console.log(`User left chat: ${chatId}`);
    });

    socket.on("sendMessage", (data) => {
        // console.log("Message received:", data.message);
        // Broadcast the message to the specified chat room
        io.to(data.chatId).emit("emitFromBackend", { message: data.message, chatId: data.chatId, senderId: data.senderId });
        // console.log(`Message emitted to room: ${data.chatId}`);
    });

    socket.on('disconnect', () => {
        // console.log(socket.id + ' has disconnected');
    });
});
