var socket = io();
socket.on('connect', function () {

    //fire a custom event to Server
    // socket.emit('createEmail',{
    //     to:'email@example',
    //     text:'Hey.this is me'
    // });

    // socket.emit('createMessage',{
    //     from:'email@example',
    //     text:'Hey.this is me'
    // });

    console.log('connected to server');
});

socket.on('disconnect', function ()  {
    console.log('Disconnected from Server');
});

socket.on('newMessage', function (message) {
    console.log(message);
});

//listenning to a custom event from server
socket.on('newEmail',function (email) {
    console.log('new email ',email);   
});

socket.on('newUserConnected',function(message) {
    console.log('new User Message : ',message);
});