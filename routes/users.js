var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var resources = require("../resources");
var player_class = resources.Player;

var db_name = "mega_event";
var player_table = "players";

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
var playerSchema = mongoose.Schema(player_class.schema);

var playerModel = mongoose.model(player_table,playerSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get("/players",function(req,res)
{
  var players = playerModel.find({});
  console.log(players);
  if (players.length > 0)
  {
    console.log("players found...");
    res.status(200).send(players);
  }
  else
  {
    console.log("no players found...");
    res.status(404).send("No players...");
  }
});

router.post("/newPlayer/:name/:id", function(req,res)
{
  var name = req.params.name;
  var id = req.params.id;
  console.log("\n\n Creating new player...");

  var player = new player_class(id,name);
  console.log("player object made...");

  var player_instance = new playerModel(player);

  player_instance.save();
  console.log("Player object saved: ");


  res.status(200).send()
});

module.exports = router;
