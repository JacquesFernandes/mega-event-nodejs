var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var request = require("request");
var resources = require("../resources");
var Player = resources.Player;
var schemas = require("../Schemas");
var weaponTypeSchema = schemas.weaponTypeSchema;
var weaponSchema = schemas.weaponSchema;
var playerSchema = schemas.playerSchema;
var PlayerModel = schemas.PlayerModel;

router.get('/', function (req, res, next)
{
  if (!req.sess.username)
  {
    res.redirect("http://www.teknack.in");
    return;
  }

  res.render('shop');
  return;
});
/*** APIs ***/
router.get("/getTiers", function(req,res)
{
  tiers = getTiers();
  res.send(tiers);
});

router.post("/purchase/:tier/:weapon_class",function(req,res)
{
  if (!req.sess.username)
  {
    //console.log("Cookie not found!");
    res.redirect("http://www.teknack.in");//res.redirect("/users/setCookie");
    return;
  }

  PlayerModel.findOne({username:req.sess.username}, function(err,player)
  {
    
    if (err)
    {
      console.log(err);
    }

    if (player === null || player === undefined)
    {
      player = makeNewPlayer(req.sess.username);
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

    var unlocked_status = player.get("weapons").get(weapon_class).get(tier+"_unlocked"); //checks if current level has weapon unlocked
    console.log("unlocked_status: "+unlocked_status);
    if (!unlocked_status) // TODO: USE SID'S API HERE // if not unlocked, run transaction
    { 
      //fetch points
      //check points
      //deduct points
      console.log("purchasing!");
      //console.log(player);
      unlock_tier = tier+"_unlocked";
      player.get("weapons").get(weapon_class).set(unlock_tier,true);
    }
    
    //update player DONE
    var tiers_layout = getTiers();
    var given_level = tier.split("").pop();
    var new_hp = Number(tiers_layout[tier]["HP"]) + Number(tiers_layout[tier][weapon_class]["bonus_hp"]);
    if (new_hp > player.get("hp"))
    {
      player.set("hp",new_hp);
    }

    var new_weapon_config = tiers_layout[tier][weapon_class];
    player.get("weapons").get(weapon_class).set("level",given_level); // set new level for selected weapon
    player.get("weapons").get(weapon_class).set("dmg",new_weapon_config.dmg); // set new damage
    player.get("weapons").get(weapon_class).set("rate",new_weapon_config.fire_rate); // set new firing rate

    console.log(player);
    player.save(function(err)
    {
      if (err)
      {
        console.log(err);
      }
    });
    res.send({status:"success"});
  });

});


router.get("/getUnlocked",function(req,res)
{
  /*
   * Tier 0: 00 01 02
   * Tier 1: 03 04 05
   * Tier 2: 06 07 08
   * Tier 3: 09 10 11
   */

  if (!req.sess.username)
  {
    res.redirect("http://www.teknack.in");
    return;
  }
  
  PlayerModel.findOne({username:req.sess.username}, function(err, player)
  {
    if (err)
    {
      console.log("ERROR FROM shop.js/unlocked -> PlayerModel.findOne");
      console.log(err);
    }

    if (player === null || player === undefined)
    {
      player = makeNewPlayer(req.sess.username);
    }

    var sniper_set = {
      t0: player.get("weapons").get("sniper").get("t0_unlocked"),
      t1: player.get("weapons").get("sniper").get("t1_unlocked"),
      t2: player.get("weapons").get("sniper").get("t2_unlocked"),
      t3: player.get("weapons").get("sniper").get("t3_unlocked")
    };

    var light_set = {
      t0: player.get("weapons").get("light").get("t0_unlocked"),
      t1: player.get("weapons").get("light").get("t1_unlocked"),
      t2: player.get("weapons").get("light").get("t2_unlocked"),
      t3: player.get("weapons").get("light").get("t3_unlocked")
    };

    var heavy_set = {
      t0: player.get("weapons").get("heavy").get("t0_unlocked"),
      t1: player.get("weapons").get("heavy").get("t1_unlocked"),
      t2: player.get("weapons").get("heavy").get("t2_unlocked"),
      t3: player.get("weapons").get("heavy").get("t3_unlocked")
    };



    var to_send = [light_set.t0, heavy_set.t0, sniper_set.t0, light_set.t1, heavy_set.t1, sniper_set.t1, light_set.t2, heavy_set.t2, sniper_set.t2, light_set.t3, heavy_set.t3, sniper_set.t3];

    res.send(to_send);
    return;
  });
});

module.exports = router;

/* SUPPORT FUNCTIONS */
var makeNewPlayer = function(username)
{
  console.log("Couldn't find "+username+" in database...");
  var name = username;
  //var id = req.params.id;
  console.log("creating a new player "+name);
  var player = new Player(name);
  //console.log(player);
  var player_instance = new PlayerModel(player.toJSON());
  player_instance.save(function(err)
  {
    console.log(player_instance)
    console.log(err);

  });
  return(player_instance);

  
};

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

