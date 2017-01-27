var express = require("express");
var router = express.Router();

router.get("/", function(req, res) // GUI
{ // This method is to render the page

});


/*** APIs ***/
router.get("/getTiers", function(req,res)
{
  tiers = getTiers();
});


/*** Supplementary methods ***/
function getTiers()
{
  tiers = {
    "t1":{
      "HP": 100
    },
    "t2":{
      "HP": 120
    },
    "t3":{
      "HP": 130
    }
  };
}
