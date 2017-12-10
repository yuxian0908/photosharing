$(function () {
    //- 連接socket
    var socket = io();
    var chatter_count;

    //- //- 接收房間人數API
    //- $( document ).ready(function() {
    //-     var room_name= document.location.pathname.match(/[^\/]+$/)[0];
    //-     $.ajax({
    //-         url: '/chat/get_chatters',
    //-         type: 'POST',
    //-         dataType: 'json',
    //-         data: {
    //-             'room': room_name,
    //-             'username': user.username
    //-         },
    //-         success: function (res) {
    //-             console.log(res);
    //-             console.log('現在有'+res.length+'人');
    //-         }
    //-     });
    //- });

    //- 接收對話API
    $( document ).ready(function() {
        var room_name= document.location.pathname.match(/[^\/]+$/)[0];
        $.ajax({
            url: '/chat/get_messages',
            type: 'POST',
            dataType: 'json',
            data: {
                'room': room_name,
                'username': user.username
            },
            success: function (res) {
                for(var i=0; i<res.length; i++){
                    $('#messages').append($('<li>').text(res[i].sender+' : '+res[i].message));
                }
                console.log(res);
                console.log('現在有'+res.length+'則對話');
            }
        });
    });

    //- //- 加入房間API
    //- $(document).ready(function() {
    //-     var room_name= document.location.pathname.match(/[^\/]+$/)[0];
    //-     $.ajax({
    //-         url: '/chat/join',
    //-         type: 'POST',
    //-         dataType: 'json',
    //-         data: {
    //-                 'username': user.username,
    //-                 'room': room_name
    //-         },
    //-         success: function (res) {
    //-             console.log(res);
    //-             console.log(user.username + '加入房間');
    //-         }
    //-     });
    //- });
   


    //- 發送訊息 emit到後端
    $('#submitMessage').submit(function(){
        var username = user.username;
        var message = $('#message').val();
        var room_name= document.location.pathname.match(/[^\/]+$/)[0];
        $.ajax({
            url: '/chat/send_message',
            type: 'POST',
            dataType: 'json',
            data: {
                'username': username,
                'message': message,
                'room' : room_name
            },
            success: function (response) {
                if (response.status == 'OK') {
                    socket.emit('chat message', {
                        'username': username,
                        'message': message
                    });
                    $('#message').val('');
                }
            }
        });
    });

    //- 發送訊息 接收後端emit
    socket.on('chat message', function(data){
        $('#messages').append($('<li>').text(data.username + ' : ' + data.message));
    });

    //- 加入房間 emit到後端
    socket.emit('join', user.username);

    //- 通知房间内人员 接收後端emit
    socket.on('joined', function(sysMsg, users){
        $('#messages').append($('<li>').text(sysMsg));
    });            

});