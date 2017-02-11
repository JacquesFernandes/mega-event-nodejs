var express = require('express');
var router = express.Router();
var Schemas = require("../Schemas");
var playerModel = Schemas.PlayerModel;
var request = require("request");
var resources = require("../resources");
var Player = resources.Player;

router.get('/', function (req, res, next){

    if (req.sess.username === null || req.sess.username === undefined){
        res.redirect("http://www.teknack.in");
        return;
    }

    //check if player exists, otherwise make and store
    playerModel.find({username: req.sess.username}, function(err,player){

        if (player === null || player === undefined){

            var new_player = new Player(req.sess.username);
            var player_instance = new playerModel(player.toJSON());

            //console.log(player_instance);
            player_instance.save();

            console.log("[NOTE] New player "+req.sess.username);
    
        }
    });

    res.render('index');

});

module.exports = router;
