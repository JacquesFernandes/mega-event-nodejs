var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var resources = require("../resources");
var Player = resources.Player;
var db_name = "mega_event";
var player_table = "players";
//var session = require("client-sessions");

mongoose.connect("mongodb://localhost/"+db_name);
// Schemas
/*
var playerSchema = mongoose.Schema({
  userid: String,
  username: String,
  hp: Number,
  movement_speed: Number
  exp: Number,
  level: Number
});
*/

var weaponTypeSchema = mongoose.Schema({
  level: Number,
  rate: Number,
  name: String,
  dmg: Number
});
var weaponSchema = mongoose.Schema({
  light:{
    type: weaponTypeSchema
  },
  heavy:{
    type: weaponTypeSchema
  },
  sniper:{
    type:weaponTypeSchema
  }
});
var playerSchema = mongoose.Schema({
  username: String,
  hp: Number,
  movement_speed: Number,
  exp: Number,
  level: Number,
  weapons: {
      type: weaponSchema
  }
});

var playerModel = mongoose.model(player_table,playerSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
router.get("/players",function(req,res)
{
  playerModel.find({}, function(err, players)
  {
    if (players.length > 0)
    {
      res.status(200).send(players);
    }
    else
    {
      res.status(404).send("No players...");
    }
  });
});
*/

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
      var weapons = player.weapons.toJSON()[0];

      ret.dmg = {
        light: weapons.light[0].dmg,
        heavy: weapons.heavy[0].dmg,
        sniper: weapons.sniper[0].dmg
      };
      ret.attack_speed = {
        light: weapons.light[0].rate,
        heavy: weapons.heavy[0].rate,
        sniper: weapons.sniper[0].rate
      }

      res.status(200).send(ret);
    }
    else
    {
      res.status(404).send({error: "Player "+name+" not found...."});
    }
  });
});

router.post("/newPlayer/:name/:id", function(req,res) // Disable afterwards ?
{
  var name = req.params.name;
  var id = req.params.id;

  var player = new Player(id,name);
  console.log(player.toJSON());
  var player_instance = new playerModel(player.toJSON());
  player_instance.save();

  res.status(200).send(player.toJSON());
});

router.get("/getCookie",function(req, res, next)
{
  if (req.SomeCookie)
  {
    var cookie = req.SomeCookie;
    res.send(cookie.data);
  }
  else
  {
    res.send("Sorry, no cookie for you....");
  }
});

router.get("/setCookie",function(req, res)
{
  console.log("REACHED");
  req.SomeCookie.status = true;
  console.log("cookie should be set: "+req.SomeCookie);
  //console.log(req.SomeCookie);
  res.send(req.SomeCookie);
  res.end();
});

module.exports = router;
