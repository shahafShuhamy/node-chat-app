const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socket(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) =>{
    console.log('new user connected');
    //fires a custom event to Client
   
    socket.on('join',(params, callback)=>{
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('name and room name are required!');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList',users.getUserList(params.room));
        socket.emit('newMessage',generateMessage('Admin','Welcome new User'));
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
        callback();
    });
    //listenning to a custom event from client
    socket.on('createMessage', (message, callback) =>{
        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
        }
        callback('this is from the server');
    });

    socket.on('createLocationMessage',(coords) =>{
        var user = users.getUser(socket.id);
        if(user){
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect',() =>{
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',generateMessage('Admin',`User : ${user.name} has left.`));
        }
        console.log('user has been disconnected');
    });
});

server.listen(port,() =>{
    console.log(`server running on port ${port}`);
})