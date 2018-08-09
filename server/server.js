const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socket(server);


app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('new user connected');
    //fires a custom event to Client

    socket.emit('newMessage',{
        from:'remote User',
        text:"hi there i'm remote user",
        createdAt:'09/08/2018'
    });

    //listenning to a custom event from client
    socket.on('createMessage', (newMessage) =>{
        console.log('create message',newMessage);
    });

    socket.on('disconnect',() =>{
        console.log('user has been disconnected');
    });
});



server.listen(port,() =>{
    console.log(`server running on port ${port}`);
})