const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socket(server);


app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('new user connected');
    //fires a custom event to Client
   socket.emit('newUserConnected',generateMessage('Admin','Welcome new User'));
   socket.broadcast.emit('newMessage',generateMessage('Admin','new user joined chat room'));

    //listenning to a custom event from client
    socket.on('createMessage', (message) =>{
        console.log('create message',message);
        io.emit('newMessage',generateMessage(message.from,message.text));
        // socket.broadcast.emit('newMessage',{
        //         from: message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()})
    });

    socket.on('disconnect',() =>{
        console.log('user has been disconnected');
    });
});

server.listen(port,() =>{
    console.log(`server running on port ${port}`);
})