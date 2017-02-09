var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var player_lobby = [];
/* ROUTES */
router.get("/",function(req,res)
{
    if (req.SomeCookie.username)
    {
        player_lobby.push(req.SomeCookie.username);
    }
    else
    {
        res.redirect("/");
    }
    res.render("lobby");
});


module.exports = router;

/*** SUPPORT METHODS ***/
