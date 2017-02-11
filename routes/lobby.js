var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var _ = require("underscore");
var Schemas = require("../Schemas");
var playerModel = Schemas.PlayerModel;
var request = require("request");

var host_queue = []; //usernames
var client_queue = []; //usernames
var matches = []; //store {host:<host>,client:<client>} objects

/* ROUTES */
router.get("/",function(req, res){
    if (req.sess.username === null || req.sess.username === undefined)
    {
        res.redirect("http://www.teknack.in");
    }

    res.render("lobby");
});

router.post("/ready/", function(req,res)
{
    var username = "";
    if (req.sess.username === undefined || req.sess.username === null)
    {
        //username = req.params.name;
        res.redirect("https://www.teknack.in");
        return;
    }
    else
    {
        username = req.sess.username;        
    }

    if (host_queue.length < 1)
    {
        host_queue.push(username);
        //res.redirect("/game/host"); // TODO : PRODUCTION
        res.send("sent "+username+" to host");
        console.log("sent "+username+" to host");
        return;
    }
    else
    {
        var some_host = host_queue[0];
        host_queue = _.rest(host_queue,1);

        //var host_data = getFightDetails(some_host);

        request({uri:"http://localhost:3011/users/getFightInfo/"+some_host},function(err,response,body)
        {
            if (err)
            {
                console.log("ERROR WITH FETCHING FIGHT INFO FOR HOST");console.log(err);
            }

            var host_data = body;

            request({uri:"http://localhost:3011/users/getFightInfo/"+username},function(err,response,body)
            {
                if (err)
                {
                    console.log("ERROR WITH FETCHING FIGHT INFO FOR CLIENT");console.log(err);
                }

                var client_data = body;

                var match = {
                    host: JSON.parse(host_data),
                    client: JSON.parse(client_data)
                };

                console.log(match);
                res.send(match);
                matches.push(match);
                return;
            });
        });
    }
});

router.get("/getMatch/:username", function(req,res) // TODO: Change afterwards
{
    var username = req.params.username;

    _.each(matches,function(match)
    {
        if (match.host.username == username || match.client.username == username)
        {
            //console.log("reached");
            res.send(match);
            return;
        }
    });
});

router.get("/getMatchSets/",function(req,res)
{
    var simple_list = [];

    _.each(matches,function(match)
    {
        simple_list.push({
            client: {
                username: match.client.username,
                socket_id: undefined
            },
            host: {
                username: match.host.username,
                socket_id: undefined
            }
        });
    });

    res.send(simple_list);
    return;
});

router.get("/getGameStatus", function(req,res)
{
    if (queue.length < 2)
    {
        res.send({status:"Not enough players"});
        return;
    }

    host = queue[0];
    client = queue[1];
    queue = _.rest(queue,2);

});

module.exports = router;

/*** Support methods ***/

var getFightDetails = function(name){

    playerModel.findOne({ username:name }, function(err, player){
        
        var ret = {};
        if (player !== undefined && player !== null){
            
            ret.username = player.username;
            ret.movement_speed = player.movement_speed;
            ret.hp = player.hp;

            var weapons = player.weapons;

            ret.dmg = {
                light: weapons.light.dmg,
                heavy: weapons.heavy.dmg,
                sniper: weapons.sniper.dmg
            };
            ret.attack_speed = {
                light: weapons.light.rate,
                heavy: weapons.heavy.rate,
                sniper: weapons.sniper.rate
            }

            return(ret);

        }
        else{

            return(false);
        }

    });

};

/*** EXPORTED FUNCTIONS ***/

var getMatchSets = function(){

    var simple_list = [];

    _.each(matches,function(match){

        simple_list.push({
            client: {
                username: match.client.username,
                socket_id: undefined
            },
            host: {
                username: match.host.username,
                socket_id: undefined
            }
            
        });

    });

    return(simple_list);
}

module.exports.getMatchSets = getMatchSets;