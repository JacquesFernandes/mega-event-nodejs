var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var resources = require("../resources");
var Player = resources.Player;
var db_name = "mega_event";
var player_table = "players";

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

router.post("/newPlayer/:name/:id", function(req,res)
{
  var name = req.params.name;
  var id = req.params.id;

  var player = new Player(id,name);
  console.log(player.toJSON());
  var player_instance = new playerModel(player.toJSON());
  player_instance.save();

  res.status(200).send(player.toJSON());
});

module.exports = router;
