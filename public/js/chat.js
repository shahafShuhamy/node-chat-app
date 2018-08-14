var socket = io();

function scrollTobuttom(){
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }

}

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
    var params = jQuery.deparam(window.location.search);
    socket.emit('join',params, function(error) {
        if(error){
            alert(error);
            window.location.href = '/';
        }else{
            console.log('No Error');
        }
    });


    console.log('connected to server');
});

socket.on('disconnect', function ()  {
    console.log('Disconnected from Server');
});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');
    users.forEach( function(user) {
        ol.append(jQuery('<li></li>').text(user))
    });
    
    jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
    var template = jQuery('#message-template').html();
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template,{
        from: message.from,
        text: message.text,
        createdAt:formatedTime
    });
    jQuery('#messages').append(html);    
    scrollTobuttom();
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formatedTime} : ${message.text}`);
    // jQuery('#messages').append(li);
    // console.log(message);
});

//listenning to a custom event from server
socket.on('newEmail',function (email) {
    console.log('new email ',email);   
});

socket.on('newUserConnected',function(message) {
    console.log('new User Message : ',message);
});


//emit (eventName, DataToSend, CallBackFunction)
// socket.emit('createMessage',{
//     from:'client',
//     text:'hello from Client'
// },function (returndDate){
//     console.log('got message : ',returndDate);
// });

socket.on('newLocationMessage',function(message){
    var template = jQuery('#location-message-template').html();
    var formatedTime = moment(message.createdAt).format('h:mm a');
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt:formatedTime
    });
    jQuery('#messages').append(html);  
    scrollTobuttom();  
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My Current location</a>');
    // var time = moment(message.createdAt).format('h:mm a');
    // li.text(`${message.from} ${time}: `);
    // a.attr('href',message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
})

jQuery('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage',{
        from:'User',
        text: jQuery('[name=message]').val()
    },function () {
        jQuery('[name=message]').val("");
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click',function(){
    if(!navigator.geolocation){
        return alert('Geolocation not suppoerted by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send location');;
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude : position.coords.longitude
        });
        console.log(position);
    }, function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });

});