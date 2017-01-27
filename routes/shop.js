var express = require("express");
var router = express.Router();

router.get("/", function(req, res) // GUI
{ // This method is to render the page

  res.send("Shop root");
});


/*** APIs ***/
router.get("/getTiers", function(req,res)
{
  tiers = getTiers();
  res.send(tiers);
});

module.exports = router;

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
      "light":{"mov":"10", "dmg": "10", "fire_rate": "10"},
      "heavy":{"mov":"10", "dmg": "20", "fire_rate": "5"},
      "sniper":{"mov":"10", "dmg": "30", "fire_rate": "1"}
    },
    "t1":{
      "HP": 120,
      "light":{"mov":"30", "dmg": "10", "fire_rate": "20"},
      "heavy":{"mov":"10", "dmg": "30", "fire_rate": "15"},
      "sniper":{"mov":"20", "dmg": "50", "fire_rate": "1"}
    },
    "t2":{
      "HP": 130,
      "light":{"mov":"50", "dmg": "10", "fire_rate": "30"},
      "heavy":{"mov":"10", "dmg": "40", "fire_rate": "25"},
      "sniper":{"mov":"30", "dmg": "70", "fire_rate": "1"}
    },
    "t3":{
      "HP":140,
      "light":{"mov":"70", "dmg": "10", "fire_rate": "40"},
      "heavy":{"mov":"10", "dmg": "50", "fire_rate": "35"},
      "sniper":{"mov":"40", "dmg": "90", "fire_rate": "1"}
    }
  };

  return(tiers);
}
