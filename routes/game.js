module.exports = function(io){

	var express = require('express');
	var router = express.Router();
    var request = require("request");
    var _ = require('underscore');
    var Schemas = require("../Schemas");
    var playerModel = Schemas.PlayerModel;
    var SidAPI = require("../request-api");

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

    router.get('/getSessionDetails', function(req, res, next){

        var host_details;
        var client_details;

        if(req.sess.username){
            var username = req.sess.username;

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

                                    var host_socket_id = sessions[i].host_id;
                                    var client_socket_id = sessions[i].client_id;

                                    res.send({ 'host': host_details, 'client': client_details });

                                    console.log(sessions+'  line 125');
                                    
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
                                    io.sockets.emit('getclientinfo', {'username': host_name});
            
                                    res.send({ 'host': host_details, 'client': client_details });
                                    return;
                                }
                            });
                        }
                    });
                    break;
                }
            }
        }

    });

    router.get('/host', function (req, res, next){
        res.render('game_host');
    });

    router.get('/client', function (req, res, next){
        res.render('game_client');
    });

    router.post('/updateSocketId', function(req, res, next){
        var username = req.sess.username;
        var socket_id = req.body.id;

        for(var i = 0 ; i < sessions.length ; i++){
            if(sessions[i].host === username){
                sessions[i].host_id = socket_id;
                console.log(sessions);
            }
            else if(sessions[i].client === username){
                sessions[i].client_id = socket_id;
                console.log(sessions);
            }
        }
        res.send({'msg':'success'});
    });

    io.on('connection', function (socket){
        
        console.log(socket.id+' connected!');

        socket.on('playerPositionData', function(data){

            for(var i = 0 ; i < sessions.length ; i++){
                if(sessions[i].host_id === socket.id){
                    var client_socket_id = sessions[i].client_id;

                    if(io.sockets.connected[client_socket_id]){
                        io.sockets.emit('newPlayerPositionData', data);
                    }

                }
            }

        });

        socket.on('clientInput', function(data){
            
            for(var i = 0 ; i < sessions.length ; i++){
                if(sessions[i].client_id === socket.id){
                    var host_socket_id = sessions[i].host_id;
                    console.log(host_socket_id);
                    if(io.sockets.connected[host_socket_id]){
                        console.log('worked');
                        io.sockets.connected[host_socket_id].emit('newClientInput', data);
                    }

                }
            }
                    

        });

        socket.on('newClientBullet', function(data){
            
            for(var i = 0 ; i < sessions.length ; i++){
                if(sessions[i].client_id === socket.id){
                    var host_socket_id = sessions[i].host_id;

                    if(io.sockets.connected[host_socket_id]){
                        io.sockets.connected[host_socket_id].emit('spawnClientBullet', data);
                    }
                    
                }
            }

        });

        socket.on('newHostBullet', function(data){
            
            for(var i = 0 ; i < sessions.length ; i++){
                if(sessions[i].host_id === socket.id){
                    var client_socket_id = sessions[i].client_id;

                    if(io.sockets.connected[client_socket_id]){
                        io.sockets.connected[client_socket_id].emit('spawnHostBullet', data);
                    }

                }
            }

        });

        socket.on('newClientHp', function(data){
            
            for(var i = 0 ; i < sessions.length ; i++){
                if(sessions[i].host_id === socket.id){
                    var client_socket_id = sessions[i].client_id;

                    if(io.sockets.connected[client_socket_id]){
                        io.sockets.connected[client_socket_id].emit('updateClientHp', data);
                    }

                }
            }

        });

        socket.on('newHostHp', function(data){
            
            for(var i = 0 ; i < sessions.length ; i++){
                if(sessions[i].host_id === socket.id){
                    var client_socket_id = sessions[i].client_id;

                    if(io.sockets.connected[client_socket_id]){
                        io.sockets.connected[client_socket_id].emit('updateHostHp', data);
                    }

                }
            }

        });

        socket.on('disconnect', function () {
            
            var disconnectedplayerid = socket.id;

            for(var i = 0 ; i < sessions.length ; i++){

                if(sessions[i].host_id === disconnectedplayerid){

                    var client_socket_id = sessions[i].client_id;

                    if(io.sockets.connected[client_socket_id]){
                        io.sockets.connected[client_socket_id].emit('playerdisconnection');
                    }

                    var winner = sessions[i].client;
                    var loser = sessions[i].host;
                    // mega point calculations here
                    console.log(" :: HOST DISCONNECT :: STARTING TRANSFER :: ");
                    request({uri:"http://localhost:3011/users/transferPoints/"+winner+"/"+loser, method:"POST"},function(err,response, body)
                    {
                        console.log(" :: STATUS: "+body);
                    });
                    
                    sessions = _.without(sessions, _.findWhere(sessions, {'host_id': disconnectedplayerid}));
                    break;

                }
                else if(sessions[i].client_id === disconnectedplayerid){

                    var host_socket_id = sessions[i].host_id;

                    if(io.sockets.connected[host_socket_id]){
                        io.sockets.connected[host_socket_id].emit('playerdisconnection');
                    }

                    var winner = sessions[i].host;
                    var loser = sessions[i].client;
                    // mega point calculations here
                    
                    console.log(" :: CLIENT DISCONNECT :: STARTING TRANSFER :: ");
                    request({uri:"http://localhost:3011/users/transferPoints/"+winner+"/"+loser, method:"POST"},function(err,response, body)
                    {
                        console.log(" :: STATUS: "+body);
                    });

                    //mega point calculations END

                    sessions = _.without(sessions, _.findWhere(sessions, {'client_id': disconnectedplayerid}));
                    break;
                }
            
            }

        });

        socket.on('gameoverhost', function(data){

            // these are usernames
            var winner = data.winner;
            var loser = data.loser;

            // mega point calculations here
            console.log(" :: GAME OVER :: STARTING TRANSFER :: ");
            request({uri:"http://localhost:3011/users/transferPoints/"+winner+"/"+loser, method:"POST"},function(err,response, body)
            {
                console.log(" :: STATUS: "+body);
            });


            for(var i = 0 ; i < sessions.length ; i++){
                if(sessions[i].host === winner){

                    var host_socket_id = sessions[i].host_id;
                    var client_socket_id = sessions[i].client_id;

                    if(io.sockets.connected[host_socket_id]){
                        io.sockets.connected[host_socket_id].emit('gameover');
                    }

                    if(io.sockets.connected[client_socket_id]){
                        io.sockets.connected[client_socket_id].emit('gameover');
                    }

                    sessions = _.without(sessions, _.findWhere(sessions, {'host': winner}));
                    break;

                }
                else if(sessions[i].client === winner){

                    var host_socket_id = sessions[i].host_id;
                    var client_socket_id = sessions[i].client_id;

                    if(io.sockets.connected[host_socket_id]){
                        io.sockets.connected[host_socket_id].emit('gameover');
                    }

                    if(io.sockets.connected[client_socket_id]){
                        io.sockets.connected[client_socket_id].emit('gameover');
                    }

                    sessions = _.without(sessions, _.findWhere(sessions, {'host': loser}));
                    break;
                }
            }
            
        })

    });

    return router;
}