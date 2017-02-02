module.exports = function(io){

	var express = require('express');
	var router = express.Router();

    var host_name = 'mit17k';
    var client_name = 'mitesh';

    var host_socket_id;
    var client_socket_id;

    var isHostConnected = false;
    var isClientConnected = false;

    router.get('/', function (req, res, next){
        if(!isHostConnected){
            res.render('game_host');
            isHostConnected = true;
        }
        else if(!isClientConnected){
            res.render('game_client');
            isClientConnected = true;
            io.sockets.emit('startGame');
        }
        else{
            res.send('Maximum player limit reached');
        }
    });

    router.post('/new_game', function (req, res, next) {
        
        res.send({ 'host_name': host_name, 'client_name': client_name });
    });

    router.get('/host', function (req, res, next){
        res.render('game_host');
    });

    router.get('/client', function (req, res, next){
        res.render('game_client');
    });

    io.on('connection', function (socket){
        
        console.log(socket.id+' connected!');

        socket.on('idupdate', function (data) {
            
            if(data.type === 'host'){
                host_socket_id = data.id;
            }
            else if(data.type === 'client'){
                client_socket_id = data.id;
            }

        });

        socket.on('playerPositionData', function(data){

            if(io.sockets.connected[client_socket_id]){
                io.sockets.emit('newPlayerPositionData', data);
            }

        });

        socket.on('clientInput', function(data){
            
            if(io.sockets.connected[host_socket_id]){
                io.sockets.connected[host_socket_id].emit('newClientInput', data);
            }

        });

        socket.on('disconnect', function () {
            
            io.sockets.emit('playerDisconnection');
            isHostConnected = false;
            isClientConnected = false;

        });

    });

    return router;
}