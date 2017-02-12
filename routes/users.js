var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var resources = require("../resources");
var Player = resources.Player;
var db_name = "mega_event";
var player_table = "players";
var schemas = require("../Schemas");
var playerModel = schemas.PlayerModel;
var SidAPI = require("../request-api");
var _ = require("underscore");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/getLeaderBoard",function(req,res)
{
  playerModel.find({},function(err,players)
  {
    var player_list = [];
    var leaderboard_items = []; // list of {username:<username>, megapoints:<megapoints>}

    /*_.each(players,function(player)
    {
      player_list.push(player.username);

      SidAPI.getMega(player.username,function(points)
      {
        console.log(player.username+ " :: "+points);
        leaderboard_items.push({
          username: player.username,
          megapoints: points
        });
      });
    });*/

    for (var i = 0; i < players.length; i++)
    {
      player_list.push(player.username);

      SidAPI.getMega(player.username,function(points)
      {
        console.log(player.username+ " :: "+points);
        leaderboard_items.push({
          username: player.username,
          megapoints: points
        });
      });
    }

    leaderboard_items = _.sortBy(leaderboard_items,"megapoints").reverse();
    console.log(":: leaderboard start");console.log(leaderboard_items);console.log(":: leaderboard end");
    res.send(leaderboard_items.slice(0,5));
    return;
  });
});

router.get("/getPlayers",function(req,res) // Get *all* player's details
{
  playerModel.find({},function(err, players)
  {
    if (players.length > 0)
    {
      res.status(200).send(players);
    }
    else
    {
      res.status(400).send("No players present");
    }
  });
});

router.get("/getPlayer/:name", function(req,res) // Getting the player details based on the username
{
  var name = req.params.name;
  playerModel.find({username:name}, function(err, players)
  {
   
    if (players.length > 0)
    {
      res.status(200).send(players);
    }
    else
    {
      res.status(200).send("No such player...");
      console.log("error: "+err);
    }
  });
});

router.get("/getPlayerInfo",function(req,res)
{
  var name = req.sess.username;
  playerModel.findOne({username:name}, function(err, player)
  {
   
    if (player !== null && player !== undefined)
    {
      var to_send = {};
      SidAPI.getMega(player.username,function(points)
      {
        to_send.username = player.username;
        to_send.megapoints = points;
        res.send(to_send);
        return;
      });
    }
    else
    {
      res.status(400).send("No such player...");
      console.log("error: "+err);
      console.log(player);
      return;
    }
  });
});

router.get("/getFightInfo/:name",function(req,res) // done
{
  /*
  username
  movement_speed
  dmg
  hp
  atck speed
  */
  var name = req.params.name;
  playerModel.findOne({username:name},function(err, player)
  {
    var ret = {};
    if (player !== undefined && player !== null)
    {
      //console.log(player);
      ret.username = player.username;
      ret.movement_speed = player.movement_speed;
      ret.hp = player.hp;
      var weapons = player.weapons;//.toJSON()[0];
      console.log(weapons);
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

      res.status(200).send(ret);
    }
    else
    {
      res.status(404).send({error: "Player "+name+" not found...."});
    }
  });
});

router.post("/newPlayer/:name", function(req,res) // Disable afterwards ?
{
  var name = req.params.name;
  //var id = req.params.id;
  console.log("creating a new player "+name);
  var player = new Player(name);
  //console.log(player);
  var player_instance = new playerModel(player.toJSON());
  console.log(player_instance);
  player_instance.save();

  res.send(player_instance);
});

router.get("/getCookie",function(req, res, next)
{
  if (req.SomeCookie)
  {
    var cookie = req.SomeCookie;
    res.send(cookie);
  }
  else
  {
    res.send(false);
  }
});

router.get("/setCookie/:name",function(req, res) // TODO : Work on this afterwards; fetch data and set it.
{
  //console.log("REACHED");
  req.sess.username = req.params.name;
  //req.sess.status = true;
  console.log("cookie should be set for: "+req.sess.username);
  //console.log(req.SomeCookie);
  res.send("Cookie set for "+req.sess.username+"<br>Now enter the url you want to go to");
  return;

  //PRODUCTION
  //res.redirect("http://teknack.in/login");
});

router.post("/transferPoints/:winner/:loser",function(req,res)
{
  var winner = req.params.winner;
  var loser = req.params.loser;
  SidAPI.getMega(winner,function(points)
  {
      var winner_points = Number(points);

      SidAPI.getMega(loser, function(points)
      {
          var loser_points = Number(points);
          console.log("Winner points: "+winner_points+" :: Loser Points: "+loser_points);
          loser_points = Math.floor(0.9 * Number(loser_points));
          winner_points = Math.floor(Number(winner_points) + (0.1 * Number(loser_points)));
          console.log("Winner: "+winner);
          console.log("New Winner points: "+winner_points+" :: New Loser Points: "+loser_points);
          res.send(" :: Finshed transfer of points");
      });
  });
});

module.exports = router;


