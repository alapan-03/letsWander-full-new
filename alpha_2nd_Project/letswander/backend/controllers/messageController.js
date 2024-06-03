const messages = require("../models/messageModel");
const Message = require("../models/messageModel");

exports.createMessages = async (req, res) => {
    try{

        let newChat = {
            tourId: req.params.tourId,
            // userEmail: [],
            // userId: []
            // senderEmail: "",
            senderId: null,
            message: req.body.message
        };

        // if (req.user && req.user.indexOf('@') > -1) {
        //     newChat.senderEmail = req.user;
        // } else {
            newChat.senderId = req.user;
        // }

        const message = await Message.create(newChat)

        res.status(201).json({
            status: "success",
            message
        })

        
    }

    catch(err){
        res.status(500).json({
            status: "fail",
            message: err.message
        })
    }
}


exports.getMessagesByTour = async (req, res) => {
    try{
        const message = await Message.find({tourId: req.params.tourId}).populate({
            path: "senderId",
            select: "name _id email role photo"
        }).populate("tourId")

        // const message = messages.reverse();

        res.status(200).json({
            status: "success",
            message
        })
    }
    catch(err){
        res.status(500).json({
            status: 'fail',
            message: err.message
        })
    }
}