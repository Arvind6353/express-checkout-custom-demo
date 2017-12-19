module.exports = function(app){

    var socket_io    = require( "socket.io" );
    var request = require("request");
    var io  = socket_io();
    app.io  = io;

    io.on('connection', function(socket){
        socket.on('chatpostback', function(msg){
            io.emit('chatmessage','You selected '+ msg);
            console.log('postback data',msg);
            request('http://localhost:9000/postback?data='+msg, function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
            io.emit('chatpostback', body);
            });

        });
    });
}