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
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
    console.log(message);
});

//listenning to a custom event from server
socket.on('newEmail',function (email) {
    console.log('new email ',email);   
});

socket.on('newUserConnected',function(message) {
    console.log('new User Message : ',message);
});


//emit (eventName, DataToSend, CallBackFunction)
socket.emit('createMessage',{
    from:'client',
    text:'hello from Client'
},function (returndDate){
    console.log('got message : ',returndDate);
});

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage',{
        from:'User',
        text: jQuery('[name=message]').val()
    },function () {

    });
});