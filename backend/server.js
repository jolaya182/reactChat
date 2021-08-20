const express = require('express');
const app = express();
const socket = require('socket.io');
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = app.listen(port, ()=>console.log("listening to port", port));
const cors = {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowHeaders: ['Content-Type']
  };
const io = socket(server, cors);
const users = {};

io.on("connection", (clientSocket)=>{
    // console.log("hit", clientSocket);
    clientSocket.join("chatRoom",()=>{
        console.log("joined")
    } );

    clientSocket.on("joinChat",(player)=>{
        console.log("player", player);
        users[clientSocket.id]=player;
        console.log("users", users);
        clientSocket.to("chatRoom").emit("addedUsersToChatRoom", users);
    })

    clientSocket.on("disconnect", ()=>{
        delete users[clientSocket.id];
        console.log("deleted, new users", users)
        clientSocket.to("chatRoom").emit("addedUsersToChatRoom", users);
    })

    clientSocket.on("sendMessage", (message)=>{
        console.log("received", message);
        clientSocket.to("chatRoom").emit("receiveMessage", message);

    })
})