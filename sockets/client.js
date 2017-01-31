module.exports = function (io) {

    var player_1;
    var player_2;

    var no_of_players = 0;

    io.on('connection', function (socket){
        
        console.log(socket.id+' connected!');

        socket.on('newPlayerRegistration', function (data) {
            if(no_of_players === 0){
                player_1 = data;
                no_of_players++;
            }
            else if(no_of_players === 1){
                player_2 = data;
                no_of_players++;
            }
        });

        socket.on('getPlayerInfo', function(data) { 
            if(no_of_players === 2){
                io.sockets.emit('playerDetails', {
                    'player_1_username': player_1.username,
                    'player_1_x': player_1.x,
                    'player_1_y': player_1.y,
                    'player_2_username': player_2.username,
                    'player_2_x': player_2.x,
                    'player_2_y': player_2.y,
                });
            }
        });
        
    });
};