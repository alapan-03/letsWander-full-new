const mongoose = require("mongoose");
const User = require("./userModel");

const chatSchema = mongoose.Schema({
    userId: {
        type: [mongoose.Schema.ObjectId],
        ref: "User"
    },
    admin: mongoose.Schema.ObjectId,
    guide: mongoose.Schema.ObjectId,
    tourId: {
        type:mongoose.Schema.ObjectId,
        ref: "Tour"
    },
    userEmail: {
        type: [String],
        ref: "User"
    }
})

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;