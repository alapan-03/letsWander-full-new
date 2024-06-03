const Chat = require("../models/chatModel")
const Tour = require("../models/tourModel")
const User = require("../models/userModel")
const Message = require("../models/messageModel")

exports.createChat = async (req, res) => {
    try {
        // Extract the tourId from the request parameters
        const tourId = req.params.tourId;
        console.log(tourId);

        // Check if there is already a chat for the given tourId
        let isChat = await Chat.findOne({ tourId: tourId }).populate('userId').populate({
            path: 'tourId',
            select: "name _id price duration image"
        });
        console.log(isChat);

        // Find the user
        const user = await User.findById(req.user);

        if (isChat) {
            // Add user to the chat if not already added
            if (!isChat.userId.includes(req.user)) {
                isChat.userId.push(req.user);
            }

            // Add chat to user's chatJoined if not already added
            if (!user.chatJoined.includes(tourId)) {
                user.chatJoined.push(tourId);
            }

            // Save the updated chat document
            await isChat.save();
        } else {
            // Create a new chat document
            let newChat = {
                tourId: tourId,
                userId: [req.user]
            };

            // Add chat to user's chatJoined if not already added
            if (!user.chatJoined.includes(tourId)) {
                user.chatJoined.push(tourId);
            }

            isChat = await Chat.create(newChat);

            // Populate the new chat
            await isChat.populate({
                path: 'userId',
                model: User
            }).populate({
                path: 'tourId',
                model: Tour,
                select: "name _id price duration image"
            }).execPopulate();
        }

        // Save the updated user document
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: "success",
            data: isChat
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
};


