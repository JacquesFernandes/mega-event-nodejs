module.exports = function(io){

	var express = require('express');
	var router = express.Router();
    var request = require("request");
    var _ = require('underscore');
    var Schemas = require("../Schemas");
    var playerModel = Schemas.PlayerModel;
    
    var sessions = [];

    router.get('/', function (req, res, next){
        
        if(req.sess && req.sess.username){
            
            if(sessions.length === 0){
                sessions.push({ 'host': req.sess.username, 'host_id': null, 'client': null, 'client_id': null });
                res.redirect('/game/host');
                console.log(sessions);
            }
            else{

                for(var i = 0 ; i < sessions.length ; i++){
                    if(!sessions[i].client){

                        sessions[i].client = req.sess.username;
                        res.redirect('/game/client');
                        console.log(sessions);
                        return;

                    }
                }

                sessions.push({ 'host': req.sess.username, 'host_id': null, 'client': null, 'client_id': null });
                res.redirect('/game/host');
                console.log(sessions);
                return;

            }

        }

    });

    router.get('/getUsername', function (req, res, next){

        if(req.sess && req.sess.username){

            res.send({ 'username': req.sess.username });

        }
        else{

            res.redirect('http://teknack.in');

        }
    });

    router.post('/getSessionDetails', function(req, res, next){

        var host_details;
        var client_details;

        var username = req.body.username;

        for(var i = 0 ; i < sessions.length ; i++){
            if(sessions[i].host === username){

                var client_name = sessions[i].client;

                playerModel.findOne({ username: username }, function(err, player_h){
        
                    var ret_h = {};
                    if (player_h !== undefined && player_h !== null){

                        ret_h.username = player_h.username;
                        ret_h.movement_speed = player_h.movement_speed;
                        ret_h.hp = player_h.hp;

                        var weapons_h = player_h.weapons;

                        ret_h.dmg = {
                            light: weapons_h.light.dmg,
                            heavy: weapons_h.heavy.dmg,
                            sniper: weapons_h.sniper.dmg
                        };
                        ret_h.attack_speed = {
                            light: weapons_h.light.rate,
                            heavy: weapons_h.heavy.rate,
                            sniper: weapons_h.sniper.rate
                        }

                        host_details = ret_h;

                         playerModel.findOne({ username: client_name }, function(err, player_c){
        
                            var ret_c = {};
                            if (player_c !== undefined && player_c !== null){

                                ret_c.username = player_c.username;
                                ret_c.movement_speed = player_c.movement_speed;
                                ret_c.hp = player_c.hp;

                                var weapons_c = player_c.weapons;

                                ret_c.dmg = {
                                    light: weapons_c.light.dmg,
                                    heavy: weapons_c.heavy.dmg,
                                    sniper: weapons_c.sniper.dmg
                                };
                                ret_c.attack_speed = {
                                    light: weapons_c.light.rate,
                                    heavy: weapons_c.heavy.rate,
                                    sniper: weapons_c.sniper.rate
                                }
                                
                                client_details = ret_c;

                                res.send({ 'host': host_details, 'client': client_details });
                                return;
                            }
                        });
                    }

                });
                break;
            }
            else if(sessions[i].client === username){

                var host_name = sessions[i].host;

                playerModel.findOne({ username: username }, function(err, player_c){

                    var ret_c = {};

                    if (player_c !== undefined && player_c !== null){

                        ret_c.username = player_c.username;
                        ret_c.movement_speed = player_c.movement_speed;
                        ret_c.hp = player_c.hp;

                        var weapons_c = player_c.weapons;

                        ret_c.dmg = {
                            light: weapons_c.light.dmg,
                            heavy: weapons_c.heavy.dmg,
                            sniper: weapons_c.sniper.dmg
                        };
                        ret_c.attack_speed = {
                            light: weapons_c.light.rate,
                            heavy: weapons_c.heavy.rate,
                            sniper: weapons_c.sniper.rate
                        }
                        
                        client_details = ret_c;

                        playerModel.findOne({ username: host_name }, function(err, player_h){
        
                            var ret_h = {};
                            if (player_h !== undefined && player_h !== null){

                                ret_h.username = player_h.username;
                                ret_h.movement_speed = player_h.movement_speed;
                                ret_h.hp = player_h.hp;

                                var weapons_h = player_h.weapons;

                                ret_h.dmg = {
                                    light: weapons_h.light.dmg,
                                    heavy: weapons_h.heavy.dmg,
                                    sniper: weapons_h.sniper.dmg
                                };
                                ret_h.attack_speed = {
                                    light: weapons_h.light.rate,
                                    heavy: weapons_h.heavy.rate,
                                    sniper: weapons_h.sniper.rate
                                }

                                host_details = ret_h;
                                res.send({ 'host': host_details, 'client': client_details });
                                return;
                            }
                        });
                    }
                });
                break;
            }
        }

    });

    router.get('/host', function (req, res, next){
        res.render('game_host');
    });

    router.get('/client', function (req, res, next){
        res.render('game_client');
    });

    io.on('connection', function (socket){
        
        console.log(socket.id+' connected!');

        socket.on('playerPositionData', function(data){

            // find id then send
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