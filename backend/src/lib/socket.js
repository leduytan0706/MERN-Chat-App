import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
});

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}

// store the online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("A user has connected: ",socket.id);
    
    // console.log(socket.handshake.query);

    // get the userId from the socket on the client side
    const userId = socket.handshake.query.userId;

    // add the userId to the online users map
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    // listen for disconnection and delete the user from onlineUsers
    socket.on("disconnect", () => {
        console.log("A user has disconnected: ",socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});

export {app, server, io, getReceiverSocketId};