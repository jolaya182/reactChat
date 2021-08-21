const express = require('express');
const app = express();
const socket = require('socket.io');
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
})
const server = app.listen(port, ()=>console.log("listening to port", port));
const cors = {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    allowHeaders: ['Content-Type']
  };
const io = socket(server, cors);
const users = {};

io.on("connection", (clientSocket)=>{
    console.log("hit");

    clientSocket.join("chatRoom",()=>{
        console.log("joined chatRoom");
    } );

    clientSocket.on("joinChat",(player)=>{
        users[clientSocket.id]=player;
        console.log("joinedChat users", users);
        clientSocket.to("chatRoom").emit("addedUsersToChatRoom", users);
    })

    clientSocket.on("disconnect",(reason)=>{
        if(reason === "transport close" || reason === "transport error"){
            delete users[clientSocket.id];
        console.log("deleted, new users", users, reason)
        clientSocket.to("chatRoom").emit("addedUsersToChatRoom", users);
        clientSocket.disconnect();
        }
        
    })

    clientSocket.on("connect_error", () => {
        console.log("connect_error deleted, reason: ", reason)
      });
      

    clientSocket.on("sendMessage", (message)=>{
        console.log("received", message);
        clientSocket.to("chatRoom").emit("receiveMessage", message);

    })
})

app.get('/', (req, res, next)=>{
    console.log("get hit")
    res.send({data: users})
})