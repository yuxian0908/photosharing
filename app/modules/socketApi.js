var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

io.on('connection', function(socket){
    // 獲取請求url
    // 如: http://localhost:3000/room/room_1, roomID为room_1
    var url = socket.request.headers.referer;
    var splited = url.split('/');
    var roomID = splited[splited.length - 1]; 
    var user = '';
    console.log(roomID);


    // 發送訊息 接收前端emit
    socket.on('chat message', function(msg , user){
        // 發送訊息 emit到前端
        io.to(roomID).emit('chat message', msg , user);
    });

    // 加入房間 接收前端emit
    socket.on('join', function (userName) {
        user = userName;
        // 加入房间
        socket.join(roomID);
        // 通知房间内人员 emit到前端
        io.to(roomID).emit('joined', user + '加入了房间', roomID);  
        console.log(user + '加入了' + roomID);
      });
});




module.exports = socketApi;