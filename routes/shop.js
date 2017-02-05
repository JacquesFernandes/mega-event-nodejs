var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var request = require("request");
var schemas = require("../Schemas");
var weaponTypeSchema = schemas.weaponTypeSchema;
var weaponSchema = schemas.weaponSchema;
var playerSchema = schemas.playerSchema;
var PlayerModel = schemas.PlayerModel;

// module.exports = function()
// {
//   var express = require("express");
//   var router = express.Router();
//   var mongoose = require("mongoose");
//   var resources = require("../resources");
//   var player_class = resources.Player;

//   var db_name = "mega_event";
//   var transaction_table = "transactions";
//   var player_table = "players";

//   // TODO: SET UP AUTH!!!

//   //Schemas
//   var transactionSchema = mongoose.Schema({
//     time: Date,
//     userid: String,
//     amount: Number
//   });

//   /*
//   var playerSchema = mongoose.Schema({
//     userid: String,
//     username: String,
//     hp: Number,
//     movement_speed: Number
//     exp: Number,
//     level: Number
//   });
//   */
//   var playerSchema = mongoose.Schema(player_class);

//   var transactionModel = mongoose.model(transaction_table,transactionSchema);

//   router.get("/", function(req, res) // GUI
//   { // This method is to render the page

//     res.send("Shop root");
//   });


   /*** APIs ***/
router.get("/getTiers", function(req,res)
{
  tiers = getTiers();
  res.send(tiers);
});



   /*** Supplementary methods ***/
function getTiers()
{
/*
^^ -> +20
^  -> +10
*/
  tiers = {
    "t0":{
      "HP": 100,
      "light":{"dmg": "10", "fire_rate": "10", "bonus_hp": "0"},
      "heavy":{"dmg": "20", "fire_rate": "5", "bonus_hp": "20"},
      "sniper":{"dmg": "30", "fire_rate": "1", "bonus_hp": "10"}
    },
    "t1":{
      "HP": 120,
      "light":{"dmg": "10", "fire_rate": "20", "bonus_hp": "0"},
      "heavy":{"dmg": "30", "fire_rate": "15", "bonus_hp": "20"},
      "sniper":{"dmg": "50", "fire_rate": "1", "bonus_hp": "10"}
    },
    "t2":{
      "HP": 130,
      "light":{"dmg": "10", "fire_rate": "30", "bonus_hp": "0"},
      "heavy":{"dmg": "40", "fire_rate": "25", "bonus_hp": "20"},
      "sniper":{"dmg": "70", "fire_rate": "1", "bonus_hp": "10"}
    },
    "t3":{
      "HP":140,
      "light":{"dmg": "10", "fire_rate": "40", "bonus_hp": "0"},
      "heavy":{"dmg": "50", "fire_rate": "35", "bonus_hp": "20"},
      "sniper":{ "dmg": "90", "fire_rate": "1", "bonus_hp": "10"}
    }
  };
  return(tiers);
}

router.get('/', function (req, res, next)
{
  if (!req.sess.username)
  {
    res.redirect("/users/setCookie");
    return;
  }

  res.render('shop');
});

router.get("/purchase/:tier/:weapon_class",function(req,res)
{
  if (!req.sess.username)
  {
    console.log("Cookie not found!");
    res.redirect("/users/setCookie");
    return;
  }

  PlayerModel.findOne({username:req.sess.username}, function(err,player)
  {
    
    if (player === null || player === undefined)
    {
      console.log("Couldn't find "+req.sess.username+" in database...");
      console.log("Creating a new player...");
      var url = "http://127.0.0.1:3000/users/newPlayer/"+req.sess.username+"";
      console.log("using: "+url);
      request({uri:url, method:"POST"},function(err,resp,body)
      {
        if (err)
        {
          console.log(err);
          res.send("Something went wrong with fetching player info in shop.js! 0.0");
          return;
        }
      });
    }

    var tier = req.params.tier; // "t1" | "t2" | "t3" :: "t0" is all available by default
    var weapon_class = req.params.weapon_class; // "heavy" | "light" | "sniper"
    if (["t0","t1","t2","t3"].indexOf(tier) === -1)
    {
      res.status(400).send({error: "invalid tier"});
      return;
    }

    if (["light","heavy","sniper"].indexOf(weapon_class) === -1)
    {
      res.status(400).send({error: "invalid ship class"});
      return;
    }

    //console.log(player);
    
    //fetch points
    //check points
    //deduct points


    //update player DONE
    var tiers_layout = getTiers();
    var given_level = tier.split("").pop();
    var new_hp = player.get("hp");
    if (given_level > player.get("level"))
    {
      player.set("level",given_level); // set new level
      var new_hp = tiers_layout[tier]["HP"]; // update base hp
    }
    new_hp += tiers_layout[tier]["bonus_hp"]; // increment hp with bonus hp, if any
    player.set("hp",net_hp);

    var new_weapon_config = tiers_layout[tier][weapon_class];
    player.get("weapons").get(weapon_class).set("level",given_level); // set new level for selected weapon
    player.get("weapons").get(weapon_class).set("dmg",new_weapon_config.dmg); // set new damage
    player.get("weapons").get(weapon_class).set("rate",new_weapon_config.fire_rate); // set new firing rate
    
    console.log(player);
    res.send("Done :D");
  });

});

module.exports = router;