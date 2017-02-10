module.exports = function(io){

	var express = require('express');
	var router = express.Router();
    var request = require("request");

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

        var username = req.sess.username;

        request({uri:"/lobby/getMatch/"+username},function(err,response,body)
        {
            console.log(body);
            var data = JSON.parse(body)
            res.send(data); //FORMAT : {"host": <host object>: "client": <client object>} :: object formats are as specified in users/getFightInfo
            return;
            //res.send({ 'host_name': host_name, 'client_name': client_name }); // UNCOMMENT AFTERWARDS
        });
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

        socket.on('newClientBullet', function(data){
            
            if(io.sockets.connected[host_socket_id]){
                io.sockets.connected[host_socket_id].emit('spawnClientBullet', data);
            }

        });

        socket.on('newHostBullet', function(data){
            
            if(io.sockets.connected[client_socket_id]){
                io.sockets.connected[client_socket_id].emit('spawnHostBullet', data);
            }

        });

        socket.on('newClientHp', function(data){
            
            if(io.sockets.connected[client_socket_id]){
                io.sockets.connected[client_socket_id].emit('updateClientHp', data);
            }

        });

        socket.on('newHostHp', function(data){
            
            if(io.sockets.connected[client_socket_id]){
                io.sockets.connected[client_socket_id].emit('updateHostHp', data);
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