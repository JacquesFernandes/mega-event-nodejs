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


//   /*** APIs ***/
//   router.get("/getTiers", function(req,res)
//   {
//     tiers = getTiers();
//     res.send(tiers);
//   });

//   module.exports = router;

//   /*** Supplementary methods ***/
//   function getTiers()
//   {
//   /*
//   ^^ -> +20
//   ^  -> +10
//   */

//     tiers = {
//       "t0":{
//         "HP": 100,
//         "light":{"mov":"10", "dmg": "10", "fire_rate": "10", "bonus_hp": "0"},
//         "heavy":{"mov":"10", "dmg": "20", "fire_rate": "5", "bonus_hp": "20"},
//         "sniper":{"mov":"10", "dmg": "30", "fire_rate": "1", "bonus_hp": "10"}
//       },
//       "t1":{
//         "HP": 120,
//         "light":{"mov":"30", "dmg": "10", "fire_rate": "20", "bonus_hp": "0"},
//         "heavy":{"mov":"10", "dmg": "30", "fire_rate": "15", "bonus_hp": "20"},
//         "sniper":{"mov":"20", "dmg": "50", "fire_rate": "1", "bonus_hp": "10"}
//       },
//       "t2":{
//         "HP": 130,
//         "light":{"mov":"50", "dmg": "10", "fire_rate": "30", "bonus_hp": "0"},
//         "heavy":{"mov":"10", "dmg": "40", "fire_rate": "25", "bonus_hp": "20"},
//         "sniper":{"mov":"30", "dmg": "70", "fire_rate": "1", "bonus_hp": "10"}
//       },
//       "t3":{
//         "HP":140,
//         "light":{"mov":"70", "dmg": "10", "fire_rate": "40", "bonus_hp": "0"},
//         "heavy":{"mov":"10", "dmg": "50", "fire_rate": "35", "bonus_hp": "20"},
//         "sniper":{"mov":"40", "dmg": "90", "fire_rate": "1", "bonus_hp": "10"}
//       }
//     };


//     return(tiers);
//   }

//   function logTransaction(userid,amount)
//   {
//     var date = new Date();
//     var time = date.getTime();
//     var transaction_instance = new transactionModel();

//     transaction_instance.time = time;
//     transaction_instance.userid = userid;
//     transaction_instance.amount = amount;

//     transaction_instance.save();
//   }

//   function getTransactions()
//   {
//     var results = transactionModel.find({});
//     return(results);
//   }
// };

var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");

/* DB Details, change when deploying */
var db_username = "";
var db_password = "";
var db_name = "mega-event";
var auth_connect_string = "mongodb://"+db_username+":"+db_password+"@localhost/"+db_name;
var connect_string = "mongodb://localhost/"+db_name;
mongoose.connect(connect_string);


router.get('/', function (req, res, next)
{
  req.SomeCookie;
  res.render('shop');
});

module.exports = router;