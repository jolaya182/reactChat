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

io.on("connection", (clientSocket)=>{
    console.log("hit", clientSocket);

    clientSocket.on("sendMessage", (message)=>{
        console.log("received", message);
        clientSocket.emit("receiveMessage", "right back at you")
    })
})