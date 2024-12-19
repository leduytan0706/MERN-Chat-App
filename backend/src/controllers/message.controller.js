import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId } from "../lib/socket.js";
import { io } from "../lib/socket.js";

const getUsersForSideBar = async (req,res) => {
    try {
        const loggedInUserId = await req.user._id;
        // find all users not including the logged in user (_id not equal to loggedInUserId)
        let filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        
        filteredUsers = filteredUsers.map((user) => user.toObject({getters: true}));

        // console.log(filteredUsers);

        return res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUsersForSideBar: ", error.message);
        return res.status(500).json({message: "Internal Server Error"});   

    }
};

const getMessages = async (req,res) => {
    const userToChatId = req.params.id;
    const myId = req.user._id;

    try {
        // find all messages between the logged in user and the userToCharId
        let messages = await Message.find(
        {
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        });

        messages = messages.map((message) => message.toObject({getters: true}));

        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages: ", error.message);
        return res.status(500).json({message: "Internal Server Error"});   

    }
};

const sendMessage = async (req,res) => {
    const {text, image} = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    try {
        let imageUrl="";
        if (image){
            // upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        // send message in realtime if the receiver is online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId){
            // only send to the receiver socket
            io.to(receiverSocketId).emit("newMessage", newMessage.toObject({getters: true}));
        }        

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage: ", error.message);
        return res.status(500).json({message: "Internal Server Error"});   

    }
};

export {getUsersForSideBar, getMessages, sendMessage};