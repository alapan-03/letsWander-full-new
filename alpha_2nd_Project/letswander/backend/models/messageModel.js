const mongoose = require("mongoose");
// const User = require("./../models/userModel");

const messageSchema = mongoose.Schema({
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
    },
    senderEmail: {
        type: String,
        ref: "User"
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: [true, "Empty message cannot be posted"]
    }
})

const messages = mongoose.model("Message", messageSchema);

module.exports = messages;