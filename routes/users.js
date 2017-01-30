var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
//var resources = require("../resources");
//var player_class = new resources.Player();

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

var weaponSchema = mongoose.Schema({
  level: Number,
  rate: Number,
  name: String,
  dmg: Number
});
var playerSchema = mongoose.Schema({
  username: String,
  hp: Number,
  movement_speed: Number,
  exp: Number,
  level: Number,
  weapons: [
    light: {
      type: weaponSchema
    },
    heavy: {
      type: weaponSchema
    },
    sniper: {
      type: weaponSchema
    }
  ]
});

var playerModel = mongoose.model(player_table,playerSchema);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get("/players",function(req,res)
{
  playerModel.find({}, function(err, players)
  {
    console.log("FOUND ");
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
});

router.get("/")

router.post("/newPlayer/:name/:id", function(req,res)
{
  var name = req.params.name;
  var id = req.params.id;



  res.status(200).send()
});

module.exports = router;
