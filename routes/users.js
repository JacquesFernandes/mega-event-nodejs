var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var resources = require("../resources");
var Player = resources.Player;
var db_name = "mega_event";
var player_table = "players";
var schemas = require("../Schemas");
var playerModel = schemas.PlayerModel;

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
      res.status(404).send("No players present");
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

router.get("/setCookie",function(req, res) // TODO : Work on this afterwards; fetch data and set it.
{
  //console.log("REACHED");
  req.sess.username = "J2";
  //req.sess.status = true;
  console.log("cookie should be set for: "+req.sess.username);
  //console.log(req.SomeCookie);
  res.redirect("/shop");

  //PRODUCTION
  //res.redirect("http://teknack.in/login");
});

module.exports = router;


