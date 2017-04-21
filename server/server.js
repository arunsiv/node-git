/*jshint esversion: 6 */

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();

//Use socket.io with server
var server = http.createServer(app);
var io = socketIO(server);

//Create new users object
var users = new Users();

//Static Middleware
app.use(express.static(publicPath));

//Socket IO events
//Connection event
io.on('connection', (socket) => {

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            //error, call callback function with error param
            return callback('Name and Room Name are required');
        } else if (users.checkUser(params.name)) {
            return callback('Name already exists. Choose a new name!');
        }

        //no error, user joins the chat room
        socket.join(params.room);

        //remove user with same id from other rooms
        users.removeUser(socket.id);

        //After the user joins the room, add the user info to the users class
        users.addUser(socket.id, params.name, params.room);

        //Send the list of the users in the room to the client
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //call callback function without error param
        callback();

        //Send welcome message to the new user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat App!!!'));

        //Broadcast to other users in the room that a new user joined
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined...`));
    });

    //Listen for new message from user
    socket.on('createMessage', (newMessage, callback) => {
        //Get the user sent this message using the id
        var user = users.getUser(socket.id);

        //Check if the user exists and the message is valid
        if (user && isRealString(newMessage.text)) {
            //Send the new message to all the users in the room
            //io.emit emits the event to every user
            //io.to().emit the event to only the users in the room
            io.to(user.room).emit('newMessage', generateMessage(user.name, newMessage.text));
        }
        //Ack from server
        callback();
    });

    //Listen for new location message from user
    socket.on('createLocationMessage', (coords) => {
        //Get the user sent this message using the id
        var user = users.getUser(socket.id);

        //Check if the user exists and the message is valid
        if (user) {
            //Send the new message to all the users in the room
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    //Disconnet event
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);

        if (user) {
            //Update the user list when an user leaves the chat
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));

            //Inform other users in the room that a user has left
            io.to(user.room).emit('newMessage',  generateMessage('Admin', `${user.name} has left...`));
        }
    });

});

//Server
server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});